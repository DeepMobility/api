import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '../../database/entities/challenge.entity';
import { ChallengeType } from '../../database/enums/ChallengeType';
import { ChallengeStatus } from '../../database/enums/ChallengeStatus';

@Injectable()
export class AddChallengeUsecase {
  constructor(
    @InjectRepository(Challenge)
    private challengesRepository: Repository<Challenge>,
  ) {}

  async add(
    accountId: string,
    title: string,
    description: string,
    type: string,
    status: string,
    associationName: string,
    associationLogoUrl: string,
    startDate: Date,
    endDate: Date,
    goalAmount: number,
    conversionRate: number
  ): Promise<Challenge> {  
    // Ensure dates are set to midnight UTC
    const startDateUTC = new Date(startDate);
    startDateUTC.setUTCHours(0, 0, 0, 0);

    const endDateUTC = new Date(endDate);
    endDateUTC.setUTCHours(0, 0, 0, 0);

    return this.challengesRepository.save({
      accountId,
      title,
      description,
      type: ChallengeType[type],
      status: ChallengeStatus[status],
      associationName,
      associationLogoUrl,
      startDate: startDateUTC,
      endDate: endDateUTC,
      goalAmount,
      conversionRate,
    });
  }
} 