import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../database/entities/team.entity';

@Injectable()
export class GetAccountTeamsUsecase {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async get(accountId: string): Promise<Team[]> {
    return this.teamsRepository.find({
      where: {
        account: {
          id: accountId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
} 