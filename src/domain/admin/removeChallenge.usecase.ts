import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '../../database/entities/challenge.entity';

@Injectable()
export class RemoveChallengeUsecase {
  constructor(
    @InjectRepository(Challenge)
    private challengesRepository: Repository<Challenge>,
  ) {}

  async remove(challengeId: string): Promise<any> {
    return this.challengesRepository.delete(challengeId);
  }
} 