import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class GetCompanyStatsUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async execute(accountId: string, period: 'day' | 'week' | 'month' = 'month'): Promise<any> {
    const users = await this.usersRepository.find({
      where: { account: { id: accountId }, isAdmin: false },
      relations: ['sessions', 'sessions.video'],
    });

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }

    const periodSessions = users.flatMap(user => 
      user.sessions.filter(session => session.createdAt >= startDate)
    );

    const activeUsers = new Set(periodSessions.map(s => s.user)).size;
    const totalUsers = users.length;
    const activeUsersPercentage = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

    const totalMinutes = periodSessions.reduce((sum, session) => {
      return sum + (session.video?.duration || 0) / 60;
    }, 0);

    const averageMinutesPerEmployee = activeUsers > 0 ? totalMinutes / activeUsers : 0;

    const longestStreak = Math.max(...users.map(user => user.daysInARow), 0);
    
    const allSessions = users.flatMap(user => user.sessions);
    
    const videoWatchCounts: { [key: number]: number } = {};
    allSessions.forEach(session => {
      if (session.video?.id) {
        videoWatchCounts[session.video.id] = (videoWatchCounts[session.video.id] || 0) + 1;
      }
    });
    
    const mostWatchedVideos = Object.entries(videoWatchCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
      .map(([videoId, count]) => {
        const video = allSessions.find(s => s.video?.id === Number(videoId))?.video;
        return {
          id: Number(videoId),
          name: video?.name || 'Vidéo inconnue',
          watchedCount: count,
        };
      });
    
    const sessionHours = allSessions
      .filter(s => s.createdAt)
      .map(session => session.createdAt.getHours());
    
    const averageHour = sessionHours.length > 0
      ? sessionHours.reduce((a, b) => a + b, 0) / sessionHours.length
      : 0;
    
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (29 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    const dailyActivity = last30Days.map(date => {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      const sessionsOnDay = users.flatMap(user => 
        user.sessions.filter(session => 
          session.createdAt >= date && session.createdAt < nextDay
        )
      );

      return {
        date: date.toISOString().split('T')[0],
        sessions: sessionsOnDay.length,
        users: new Set(sessionsOnDay.map(s => s.user)).size,
        minutes: Math.round(sessionsOnDay.reduce((sum, s) => sum + (s.video?.duration || 0) / 60, 0) * 10) / 10,
      };
    });

    const totalTimeWatchedAllTime = allSessions.reduce((sum, s) => sum + (s.video?.duration || 0) / 60, 0);
    
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const lastMonthSessions = allSessions.filter(s => s.createdAt >= thirtyDaysAgo);
    const lastMonthTimeWatched = lastMonthSessions.reduce((sum, s) => sum + (s.video?.duration || 0) / 60, 0);

    return {
      activeUsersPercentage: Math.round(activeUsersPercentage * 10) / 10,
      activeUsers,
      totalUsers,
      totalMinutes: Math.round(totalMinutes * 10) / 10,
      averageMinutesPerEmployee: Math.round(averageMinutesPerEmployee * 10) / 10,
      longestStreak,
      totalTimeWatchedAllTime: Math.round(totalTimeWatchedAllTime * 10) / 10,
      lastMonthTimeWatched: Math.round(lastMonthTimeWatched * 10) / 10,
      mostWatchedVideos,
      averageHour: Math.round(averageHour * 10) / 10,
      period,
      dailyActivity,
    };
  }
}

