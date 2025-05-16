import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '../../database/entities/challenge.entity';

@Injectable()
export class GetChallengeDetailsUsecase {
  constructor(
    @InjectRepository(Challenge)
    private challengesRepository: Repository<Challenge>,
  ) {}

  async get(challengeId: string): Promise<Challenge> {
    return this.challengesRepository.findOne({
      where: { id: challengeId },
      relations: ['users', 'teams'],
    });
  }
} 