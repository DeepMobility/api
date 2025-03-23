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

    const dailySessionDone = lastUserSession ? lastUserSession.createdAt.toDateString() === today.toDateString() : false;

    const dailyVideo = getDailyVideo(lastUserSession, courseVideos, dailySessionDone);

    const weekDay = today.getDay();

    const startOfWeekDiff = weekDay === 0 ? 6 : weekDay - 1;

    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - startOfWeekDiff);

    const weeklySessionsCount = orderedUserSessions.filter(session => session.createdAt > lastWeek).length;

    let lastQuarter = new Date();
    lastQuarter.setMonth(lastQuarter.getMonth() - 3);

    const isSurveyDue = user.createdAt < lastQuarter && Object.keys(user.survey).length === 0

    return {
      name: user.firstName,
      isSurveyDue,
      dailyVideo,
      dailySessionDone,
      weeklySessionsCount,
      course,
      courseVideos,
      videos,
      badges: user.badges,
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
