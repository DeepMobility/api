import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Team } from '../../database/entities/team.entity';

@Injectable()
export class EditTeamUsecase {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async edit(
    teamId: string,
    name: string,
    description: string
  ): Promise<UpdateResult> {
    return this.teamsRepository.update(teamId, {
      name,
      description
    });
  }
} 