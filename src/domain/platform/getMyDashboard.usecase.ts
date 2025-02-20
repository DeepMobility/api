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

    const orderedUserSessions = user.sessions.sort((s1, s2) => s2.createdAt.getTime() - s1.createdAt.getTime());

    const lastUserSession = orderedUserSessions.length ? orderedUserSessions[orderedUserSessions.length - 1] : null;

    const dailySessionDone = lastUserSession ? lastUserSession.createdAt.toDateString() === (new Date()).toDateString() : false

    const dailyVideo = getDailyVideo(lastUserSession, courseVideos, dailySessionDone);

    return {
      name: user.firstName,
      dailyVideo,
      dailySessionDone,
      course,
      courseVideos,
      videos,
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
