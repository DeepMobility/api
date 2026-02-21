import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, MoreThan, Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Video } from '../../database/entities/video.entity';
import { Session } from 'src/database/entities/session.entity';
import { Challenge } from 'src/database/entities/challenge.entity';
import { Webinar } from 'src/database/entities/webinar.entity';
import { ChallengeStatus } from 'src/database/enums/ChallengeStatus';

export interface ActiveWebinar {
  id: string;
  title: string;
  scheduledAt: Date;
  teamsLink: string;
  registrationLink: string | null;
  status: 'upcoming' | 'ongoing' | 'soon';
}

@Injectable()
export class GetMyDashboardUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    @InjectRepository(Challenge)
    private challengesRepository: Repository<Challenge>,
    @InjectRepository(Webinar)
    private webinarRepository: Repository<Webinar>,
  ) {}

  async get(
    userId: string,
  ): Promise<any> {
    const user = await this.usersRepository.findOne({
      relations: { sessions: { video: true}, account: true },
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const videos = await this.videosRepository.find();

    const course = user.jobType === 'remote' ? 'sitting' : user.jobType;

    const courseVideos = videos
      .filter((video) => video.course === course)
      .sort((v1, v2) => v1.coursePosition - v2.coursePosition)

    const filteredSessions = user.sessions.filter(session => session.question)

    const orderedUserSessions = filteredSessions.sort((s1, s2) => s1.createdAt.getTime() - s2.createdAt.getTime());

    const lastUserSession = orderedUserSessions.length ? orderedUserSessions[orderedUserSessions.length - 1] : null;

    const today = new Date();

    const weekDay = today.getDay();

    const startOfWeekDiff = weekDay === 0 ? 6 : weekDay - 1;
  
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - startOfWeekDiff);
  
    const dailySessionDone = lastUserSession ?
      (
        lastUserSession.createdAt.toDateString() === today.toDateString() || 
        filteredSessions.filter(session => session.createdAt > lastWeek).length >= 5
      ) : false;

    const dailyVideo = getDailyVideo(lastUserSession, courseVideos, dailySessionDone);

    const courseStartIndex = getWeeklyCourseStartIndex(lastWeek, orderedUserSessions, courseVideos);

    let lastQuarter = new Date();
    lastQuarter.setMonth(lastQuarter.getMonth() - 3);

    const isSurveyDue = user.createdAt < lastQuarter && Object.keys(user.survey).length === 0

    const orderedDailySessions = user.sessions.sort((s1, s2) => s1.createdAt.getTime() - s2.createdAt.getTime());

    const dailyActivity = orderedDailySessions.length ? orderedDailySessions.at(-1).createdAt.toDateString() === today.toDateString() : false;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayActivity = orderedDailySessions.length ? orderedDailySessions.at(-1).createdAt.toDateString() === yesterday.toDateString() : false;

    const currentChallenge = await this.challengesRepository.findOne({
      where: {
        accountId: user.account.id,
        status: In([ChallengeStatus.ACTIVE, ChallengeStatus.COMPLETED]),
        startDate: LessThan(today),
        endDate: MoreThan(new Date(today.getTime() - (Number(process.env.CHALLENGE_VISIBILITY_AFTER_END_DURATION) || 0) * 24 * 60 * 60 * 1000)),
      },
    });

    const challengeProgress = currentChallenge ? {
      totalPoints: 0,
      goalAmount: currentChallenge.goalAmount,
      usersInfo: [],
      teamsInfo: [],
      currentUserInfo: null,
      currentUserTeamInfo: null,
      participantsCount: 0
    } : null;

    if (currentChallenge) {
      const allUsers = await this.usersRepository.find({
        where: { account: { id: currentChallenge.accountId }, isAdmin: false },
        relations: { sessions: { video: true }, teams: true }
      });
      challengeProgress.participantsCount = allUsers.length;

      const userPointsMap = new Map<string, number>();
      const teamPointsMap = new Map<string, number>();

      allUsers.forEach(user => {
        const userSessions = user.sessions.filter(session =>
          session.createdAt >= currentChallenge.startDate &&
          session.createdAt <= currentChallenge.endDate
        );

        const userPoints = userSessions.reduce((total, session) =>
          total + Math.floor(session.video.duration / 60), 0
        );

        userPointsMap.set(user.id, userPoints);

        challengeProgress.totalPoints += userPoints;

        if (user.teams?.length > 0) {
          const teamId = user.teams[0].id;
          const currentTeamPoints = teamPointsMap.get(teamId) || 0;
          teamPointsMap.set(teamId, currentTeamPoints + userPoints);
        }
      });

      const userRankings = Array.from(userPointsMap.entries())
        .map(([userId, points]) => ({
          userId,
          name: allUsers.find(u => u.id === userId)?.firstName || 'Unknown User',
          points,
          rank: 0
        }))
        .sort((a, b) => b.points - a.points);

      userRankings.forEach((user, index) => {
        user.rank = index + 1;
      });

      const teamRankings = Array.from(teamPointsMap.entries())
        .map(([teamId, points]) => ({
          teamId,
          name: allUsers.find(u => u.teams?.some(t => t.id === teamId))?.teams[0]?.name || 'Unknown Team',
          membersCount: allUsers.filter(u => u.teams?.some(t => t.id === teamId)).length,
          points,
          rank: 0
        }))
        .sort((a, b) => b.points - a.points);

      teamRankings.forEach((team, index) => {
        team.rank = index + 1;
      });

      challengeProgress.usersInfo = userRankings;
      challengeProgress.teamsInfo = teamRankings;

      const currentUser = userRankings.find(ranking => ranking.userId === userId);
      const currentUserTeam = allUsers.find(u => u.id === userId)?.teams[0];
      const currentUserTeamInfo = currentUserTeam 
        ? teamRankings.find(ranking => ranking.teamId === currentUserTeam.id)
        : null;

      challengeProgress.currentUserInfo = currentUser || null;
      challengeProgress.currentUserTeamInfo = currentUserTeamInfo;
    }

    // Check if webinars are enabled and get active webinar
    let activeWebinar: ActiveWebinar | null = null;
    
    if (user.account.configuration?.webinarsEnabled) {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      
      const webinar = await this.webinarRepository.findOne({
        where: {
          accountId: user.account.id,
          isActive: true,
          //scheduledAt: MoreThan(twoHoursAgo),
        },
        order: { scheduledAt: 'ASC' },
      });

      if (webinar) {
        const scheduledTime = new Date(webinar.scheduledAt).getTime();
        const nowTime = now.getTime();
        const diffMinutes = (scheduledTime - nowTime) / (1000 * 60);

        let status: 'upcoming' | 'ongoing' | 'soon';
        
        if (diffMinutes <= 0) {
          status = 'ongoing';
        } else if (diffMinutes <= 30) {
          status = 'soon';
        } else {
          status = 'upcoming';
        }

        activeWebinar = {
          id: webinar.id,
          title: webinar.title,
          scheduledAt: webinar.scheduledAt,
          teamsLink: webinar.teamsLink,
          registrationLink: webinar.registrationLink,
          status,
        };
      }
    }

    return {
      name: user.firstName,
      isSurveyDue,
      dailyVideo,
      dailySessionDone,
      course,
      courseVideos,
      courseStartIndex,
      videos,
      badges: user.badges,
      dailyActivity,
      yesterdayActivity,
      daysInArow: user.daysInARow,
      hasReminderConfigured: !!user.reminderTime,
      ...(currentChallenge && {
        currentChallenge: {
          ...currentChallenge,
          progress: challengeProgress
        }
      }),
      ...(activeWebinar && { activeWebinar }),
      onboardingVideoUrl: user.account.configuration?.onboardingVideoUrl || null,
    };
  }
}

function getDailyVideo(lastUserSession: Session, courseVideos: Video[], dailySessionDone: boolean) {
  if (!lastUserSession) {
    return courseVideos[0]
  }

  if (dailySessionDone) {
    return lastUserSession.video
  }

  const lastSessionVideoIndex = courseVideos.findIndex((video) => video.id === lastUserSession.video.id)

  if (lastSessionVideoIndex === courseVideos.length - 1) {
    return courseVideos[0]
  }

  return courseVideos[lastSessionVideoIndex + 1]
}

function getWeeklyCourseStartIndex(lastWeek: Date, sessions: Session[], courseVideos: Video[]) {
  const sessionsBeforeThisWeek = sessions.filter(session => session.createdAt < lastWeek);

  const lastSessionBeforeThisWeek = sessionsBeforeThisWeek.length ? sessionsBeforeThisWeek.at(-1) : null;

  if (!lastSessionBeforeThisWeek) {
    return 0;
  }

  const videoIndex = courseVideos.findIndex((video) => video.id === lastSessionBeforeThisWeek.video.id)

  return videoIndex === 4 ? 0 : videoIndex + 1;
}
