import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../database/entities/team.entity';

@Injectable()
export class GetTeamStatsUsecase {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async execute(accountId: string, period: 'day' | 'week' | 'month' = 'month'): Promise<any> {
    const teams = await this.teamsRepository.find({
      where: { account: { id: accountId } },
      relations: ['members', 'members.sessions', 'members.sessions.video'],
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

    const teamStats = teams.map(team => {
      const members = (team.members || []).filter(member => !member.isAdmin);
      const totalMembers = members.length;

      const teamSessions = members.flatMap(member =>
        member.sessions.filter(session => session.createdAt >= startDate)
      );

      const activeMembers = new Set(teamSessions.map(s => s.user)).size;
      const activePercentage = totalMembers > 0 ? (activeMembers / totalMembers) * 100 : 0;

      const totalMinutes = teamSessions.reduce((sum, session) => {
        return sum + (session.video?.duration || 0) / 60;
      }, 0);

      const averageMinutes = activeMembers > 0 ? totalMinutes / activeMembers : 0;

      const longestStreak = Math.max(...members.map(m => m.daysInARow), 0);

      return {
        id: team.id,
        name: team.name,
        description: team.description,
        totalMembers,
        activeMembers,
        activePercentage: Math.round(activePercentage * 10) / 10,
        totalMinutes: Math.round(totalMinutes * 10) / 10,
        averageMinutes: Math.round(averageMinutes * 10) / 10,
        longestStreak,
      };
    });

    const rankedTeams = [...teamStats].sort((a, b) => b.totalMinutes - a.totalMinutes);

    return {
      teams: teamStats,
      ranking: rankedTeams.map((team, index) => ({
        rank: index + 1,
        teamId: team.id,
        teamName: team.name,
        totalMinutes: team.totalMinutes,
        activePercentage: team.activePercentage,
      })),
      period,
    };
  }
}

