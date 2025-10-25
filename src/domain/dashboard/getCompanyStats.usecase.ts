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
      where: { account: { id: accountId } },
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

    return {
      activeUsersPercentage: Math.round(activeUsersPercentage * 10) / 10,
      activeUsers,
      totalUsers,
      totalMinutes: Math.round(totalMinutes * 10) / 10,
      averageMinutesPerEmployee: Math.round(averageMinutesPerEmployee * 10) / 10,
      longestStreak,
      period,
      dailyActivity,
    };
  }
}

