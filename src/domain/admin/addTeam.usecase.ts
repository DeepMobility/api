import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../database/entities/team.entity';

@Injectable()
export class AddTeamUsecase {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async add(
    accountId: string,
    name: string,
    description: string
  ): Promise<Team> {
    return this.teamsRepository.save({
      account: {
        id: accountId
      },
      name,
      description
    });
  }
}