import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Challenge } from '../../database/entities/challenge.entity';
import { ChallengeType } from '../../database/enums/ChallengeType';
import { ChallengeStatus } from '../../database/enums/ChallengeStatus';

@Injectable()
export class EditChallengeUsecase {
  constructor(
    @InjectRepository(Challenge)
    private challengesRepository: Repository<Challenge>,
  ) {}

  async edit(
    challengeId: string,
    title: string,
    description: string,
    associationName: string,
    associationLogoUrl: string,
    goalAmount: number,
    conversionRate: number,
    status: string,
    type: string,
    startDate: Date,
    endDate: Date
  ): Promise<UpdateResult> {
    return this.challengesRepository.update(challengeId, {
      title,
      description,
      associationName,
      associationLogoUrl,
      goalAmount,
      conversionRate,
      status: ChallengeStatus[status.toUpperCase()],
      type: ChallengeType[type.toUpperCase()],
      startDate,
      endDate
    });
  }
} 