import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '../../database/entities/challenge.entity';

@Injectable()
export class GetAccountChallengesUsecase {
  constructor(
    @InjectRepository(Challenge)
    private challengesRepository: Repository<Challenge>,
  ) {}

  async getAccountChallenges(accountId: string): Promise<Challenge[]> {
    const query = this.challengesRepository.createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.teams', 'teams')
      .leftJoinAndSelect('challenge.users', 'users')
      .where('challenge.accountId = :accountId', { accountId });

    return query.getMany();
  }
} 