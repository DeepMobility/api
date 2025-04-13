import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from 'src/database/entities/session.entity';
import { User } from 'src/database/entities/user.entity';
import { Video } from 'src/database/entities/video.entity';

@Injectable()
export class StartSessionUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  async start(
    userId: string,
    videoId: number,
    question: string,
    questionRating: number,
  ): Promise<any> {
    const user = await this.usersRepository.findOne({
      relations: { sessions: { video: true} },
      where: { id: userId },
    });

    const video = await this.videosRepository.findOne({ where: { id: videoId }});

    const newBadges = []

    // if (!user.badges.includes("first-session")) {
    //   newBadges.push("first-session")
    // }

    if (!user.badges.includes("90min")) {
      const timeWatched = user.sessions.reduce(
        (total, session) => total + session.video.duration,
        0
      );

      if (video.duration + timeWatched > (90 * 60)) {
        newBadges.push("90min")
      }
    }

    // if (!user.badges.includes("3-sessions")) {
    //   if (user.sessions.length >= 2) {
    //     newBadges.push("3-sessions")
    //   }
    // }

    if (!user.badges.includes("3-in-1-day")) {
      const startOfDay = new Date(new Date().setHours(0, 0, 0, 0))

      const todaySessions = user.sessions.filter(session => {
        return session.createdAt > startOfDay
      })

      if (todaySessions.length >= 2) {
        newBadges.push("3-in-1-day")
      }
    }

    const today = new Date();

    if (!user.badges.includes("5-full-week") && question) {
      const filteredSessions = user.sessions.filter(session => session.question)

      const weekDay = today.getDay();

      const startOfWeekDiff = weekDay === 0 ? 6 : weekDay - 1;
  
      const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - startOfWeekDiff);
  
      const weeklySessionsCount = filteredSessions.filter(session => session.createdAt > lastWeek).length;

      if (weeklySessionsCount >= 4) {
        if (!user.badges.includes("1-full-week")) {
          newBadges.push("1-full-week")
        } else if (!user.badges.includes("2-full-week")) {
          newBadges.push("2-full-week")
        } else if (!user.badges.includes("3-full-week")) {
          newBadges.push("3-full-week")
        } else if (!user.badges.includes("4-full-week")) {
          newBadges.push("4-full-week")
        } else {
          newBadges.push("5-full-week")
        }
      }
    }

    let daysInARow = user.daysInARow

    const orderedDailySessions = user.sessions.sort((s1, s2) => s1.createdAt.getTime() - s2.createdAt.getTime());

    const dailyActivityAlreadyDone = orderedDailySessions.length ? orderedDailySessions.at(-1).createdAt.toDateString() === today.toDateString() : false;

    if (!dailyActivityAlreadyDone) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const yesterdayActivity = orderedDailySessions.length ? orderedDailySessions.at(-1).createdAt.toDateString() === yesterday.toDateString() : false;

      daysInARow = yesterdayActivity ? daysInARow + 1 : 1
    }

    await this.usersRepository.save({
      id: user.id,
      badges: [...user.badges, ...newBadges],
      daysInARow,
    });

    const session = await this.sessionsRepository.save({
      user: { id: userId },
      video: { id: videoId },
      question,
      beforeRating: questionRating
    });

    return {
      session,
      newBadges,
      updatedDaysInArow: daysInARow,
    };
  }
}
