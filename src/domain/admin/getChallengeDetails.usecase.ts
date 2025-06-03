import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '../../database/entities/challenge.entity';
import { User } from '../../database/entities/user.entity';

interface ChallengeWithProgress extends Challenge {
  progress: {
    totalPoints: number;
    participantsCount: number;
    usersInfo: {
      userId: string;
      name: string;
      points: number;
      rank: number;
    }[];
    teamsInfo: {
      teamId: string;
      name: string;
      points: number;
      rank: number;
    }[];
  };
}

@Injectable()
export class GetChallengeDetailsUsecase {
  constructor(
    @InjectRepository(Challenge)
    private challengesRepository: Repository<Challenge>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async get(challengeId: string): Promise<ChallengeWithProgress> {
    const challenge = await this.challengesRepository.findOne({
      where: { id: challengeId }
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
    
    const challengeWithProgress: ChallengeWithProgress = {
      ...challenge,
      progress: {
        totalPoints: 0,
        participantsCount: 0,
        usersInfo: [],
        teamsInfo: [],
      }
    };
    
    const allUsers = await this.usersRepository.find({
      where: { account: { id: challenge.accountId } },
      relations: { sessions: { video: true }, teams: true }
    });
    challengeWithProgress.progress.participantsCount = allUsers.length;

    const userPointsMap = new Map<string, number>();
    const teamPointsMap = new Map<string, number>();

    allUsers.forEach(user => {
      const userSessions = user.sessions.filter(session =>
        session.createdAt >= challenge.startDate &&
        session.createdAt <= challenge.endDate
      );

      const userPoints = userSessions.reduce((total, session) =>
        total + Math.floor(session.video.duration / 60), 0
      );

      userPointsMap.set(user.id, userPoints);

      challengeWithProgress.progress.totalPoints += userPoints;

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

    challengeWithProgress.progress.usersInfo = userRankings;
    challengeWithProgress.progress.teamsInfo = teamRankings;

    return challengeWithProgress;
  }
} 