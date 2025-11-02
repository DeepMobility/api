import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Session } from '../../database/entities/session.entity';

@Injectable()
export class GetWellbeingStatsUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  async execute(accountId: string, period: 'day' | 'week' | 'month' = 'month', teamId?: string): Promise<any> {
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

    let userIds: string[] | undefined;

    if (teamId) {
      const teamUsers = await this.usersRepository
        .createQueryBuilder('user')
        .innerJoin('user.teams', 'team')
        .leftJoinAndSelect('user.account', 'account')
        .where('team.id = :teamId', { teamId })
        .andWhere('account.id = :accountId', { accountId })
        .andWhere('user.isAdmin = :isAdmin', { isAdmin: false })
        .getMany();

      userIds = teamUsers.map(user => user.id);
    }

    let queryBuilder = this.sessionsRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.user', 'user')
      .leftJoinAndSelect('user.account', 'account')
      .leftJoinAndSelect('session.video', 'video')
      .where('account.id = :accountId', { accountId })
      .andWhere('session.createdAt >= :startDate', { startDate })
      .andWhere('session.question IS NOT NULL')
      .andWhere('user.isAdmin = :isAdmin', { isAdmin: false });

    if (userIds && userIds.length > 0) {
      queryBuilder = queryBuilder.andWhere('user.id IN (:...userIds)', { userIds });
    } else if (teamId) {
      queryBuilder = queryBuilder.andWhere('1 = 0');
    }

    const sessions = await queryBuilder.getMany();

    const energySessions = sessions.filter(s => s.beforeRating && s.afterRating);
    
    const energyStats = {
      averageBeforeRating: 0,
      averageAfterRating: 0,
      improvement: 0,
      totalSessions: energySessions.length,
    };

    if (energySessions.length > 0) {
      const totalBefore = energySessions.reduce((sum, s) => sum + (s.beforeRating || 0), 0);
      const totalAfter = energySessions.reduce((sum, s) => sum + (s.afterRating || 0), 0);
      
      energyStats.averageBeforeRating = Math.round((totalBefore / energySessions.length) * 10) / 10;
      energyStats.averageAfterRating = Math.round((totalAfter / energySessions.length) * 10) / 10;
      energyStats.improvement = Math.round((energyStats.averageAfterRating - energyStats.averageBeforeRating) * 10) / 10;
    }
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (29 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    const dailyEnergyEvolution = last30Days.map(date => {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      const sessionsOnDay = sessions.filter(s => 
        s.createdAt >= date && s.createdAt < nextDay && s.beforeRating && s.afterRating
      );

      const avgBefore = sessionsOnDay.length > 0
        ? sessionsOnDay.reduce((sum, s) => sum + (s.beforeRating || 0), 0) / sessionsOnDay.length
        : null;
      
      const avgAfter = sessionsOnDay.length > 0
        ? sessionsOnDay.reduce((sum, s) => sum + (s.afterRating || 0), 0) / sessionsOnDay.length
        : null;

      return {
        date: date.toISOString().split('T')[0],
        averageBeforeRating: avgBefore ? Math.round(avgBefore * 10) / 10 : null,
        averageAfterRating: avgAfter ? Math.round(avgAfter * 10) / 10 : null,
        sessionsCount: sessionsOnDay.length,
      };
    });

    let usersQueryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.account', 'account')
      .where('account.id = :accountId', { accountId })
      .andWhere('user.isAdmin = :isAdmin', { isAdmin: false });

    if (teamId) {
      usersQueryBuilder = usersQueryBuilder
        .innerJoin('user.teams', 'team')
        .andWhere('team.id = :teamId', { teamId });
    }

    const users = await usersQueryBuilder.getMany();

    const painfulBodyParts: { [key: string]: number } = {};
    users.forEach(user => {
      if (user.painfulBodyParts && Array.isArray(user.painfulBodyParts)) {
        user.painfulBodyParts.forEach(part => {
          painfulBodyParts[part] = (painfulBodyParts[part] || 0) + 1;
        });
      }
    });

    const bodyPartsWorked: { [key: string]: number } = {};
    sessions.forEach(session => {
      if (session.video?.bodyParts && Array.isArray(session.video.bodyParts)) {
        session.video.bodyParts.forEach(part => {
          bodyPartsWorked[part] = (bodyPartsWorked[part] || 0) + 1;
        });
      }
    });
    const painfulBodyPartsArray = Object.entries(painfulBodyParts)
      .map(([part, count]) => ({ part, count }))
      .sort((a, b) => b.count - a.count);

    const bodyPartsWorkedArray = Object.entries(bodyPartsWorked)
      .map(([part, count]) => ({ part, count }))
      .sort((a, b) => b.count - a.count);

    return {
      energyStats,
      dailyEnergyEvolution: dailyEnergyEvolution || [],
      painfulBodyParts: painfulBodyPartsArray || [],
      bodyPartsWorked: bodyPartsWorkedArray || [],
      period,
    };
  }
}

