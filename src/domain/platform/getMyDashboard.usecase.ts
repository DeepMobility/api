import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Video } from '../../database/entities/video.entity';
import { Session } from 'src/database/entities/session.entity';

@Injectable()
export class GetMyDashboardUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
  ) {}

  async get(
    userId: string,
  ): Promise<any> {
    const user = await this.usersRepository.findOne({
      relations: { sessions: { video: true} },
      where: { id: userId },
    });

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
