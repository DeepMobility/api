import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '../../database/entities/challenge.entity';
import { User } from '../../database/entities/user.entity';

interface ChallengeWithProgress extends Challenge {
  progress: {
    totalPoints: number;
  };
}

@Injectable()
export class GetAccountChallengesUsecase {
  constructor(
    @InjectRepository(Challenge)
    private challengesRepository: Repository<Challenge>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAccountChallenges(accountId: string): Promise<ChallengeWithProgress[]> {
    const challenges = await this.challengesRepository.find({
      where: { accountId }
    });

    const allUsers = await this.usersRepository.find({
      where: { account: { id: accountId } },
      relations: { sessions: { video: true }, teams: true }
    });

    const userPointsMap = new Map<string, number>();
    const teamPointsMap = new Map<string, number>();

    const challengesWithProgress: ChallengeWithProgress[] = [];

    challenges.forEach(challenge => {
      const challengeWithProgress: ChallengeWithProgress = {
        ...challenge,
        progress: {
          totalPoints: 0
        }
      };

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

      challengesWithProgress.push(challengeWithProgress);
    });

    return challengesWithProgress;
  }
} 