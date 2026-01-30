import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../database/entities/account.entity';
import { Video } from 'src/database/entities/video.entity';

const questions = ['energy', 'stress', 'pain']

@Injectable()
export class GetAccountDetailsUsecase {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
  ) {}

  async get(accountId: string): Promise<any> {
    const account = await this.accountsRepository.findOne({
      relations: {
        users: {
          sessions: {
            video: true
          },
        },
      },
      where: { id: accountId },
    });

    const videos = await this.videosRepository.find();

    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);

    const activeUsers = account.users.filter(user => {
      const orderedUserSessions = user.sessions.sort((s1, s2) => s1.createdAt.getTime() - s2.createdAt.getTime());

      const lastUserSession = orderedUserSessions.length ? orderedUserSessions[orderedUserSessions.length - 1] : null;

      if (!lastUserSession) {
        return false;
      }

      return lastUserSession.createdAt.toDateString() > lastMonth.toDateString();
    })

    const accountSessions = account.users.flatMap(user => user.sessions);

    const totalTimeWatched = accountSessions.reduce((totalTime, session) => {
      return totalTime + session.video.duration
    }, 0)

    const lastMonthSessions = accountSessions.filter(session => session.createdAt.toDateString() > lastMonth.toDateString());

    const lastMonthTimeWatched = lastMonthSessions.reduce((totalTime, session) => {
      return totalTime + session.video.duration
    }, 0)

    const counts = {};
    const videoWatchedIds = accountSessions.map(session => session.video.id);
    videoWatchedIds.forEach((videoId) => {
      counts[videoId] = (counts[videoId] || 0) + 1;
    });
    const uniq = [...new Set(videoWatchedIds)];
    uniq.sort((a, b) => counts[b] - counts[a]);

    const mostWatchedVideos = uniq.map(videoId => {
      const video = videos.find(v => v.id === videoId);

      return {
        id: videoId,
        name: video.name,
        watchedCount: counts[videoId]
      }
    }).slice(0, 3);

    const sessionHours = accountSessions.map(session => session.createdAt.getHours())

    const averageHour = sessionHours.reduce((a, b) => a + b, 0) / sessionHours.length;

    const dailySessions = accountSessions.filter(session => session.question)

    const ratings = questions.filter(question => question === 'energy').map(question => {
      const questionSessions = dailySessions.filter(session => session.question === question)

      const dailySessionBeforeRatings = questionSessions.filter(session => session.beforeRating).map(session => session.beforeRating);

      const averageBeforeRating = dailySessionBeforeRatings.reduce((a, b) => a + b, 0) / dailySessionBeforeRatings.length;

      const dailySessionAfterRatings = questionSessions.filter(session => session.afterRating).map(session => session.afterRating);

      const averageAfterRating = dailySessionAfterRatings.reduce((a, b) => a + b, 0) / dailySessionAfterRatings.length;

      return {
        question,
        averageBeforeRating,
        averageAfterRating,
      }
    })

    return {
      id: account.id,
      name: account.name,
      host: account.host,
      usersCount: account.users.length,
      activeUsersCount: activeUsers.length,
      totalTimeWatched,
      lastMonthTimeWatched,
      mostWatchedVideos,
      averageHour,
      ratings,
      allowedDomains: account.allowedDomains,
      configuration: account.configuration || {}
    };
  }
}
