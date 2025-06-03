import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../database/entities/team.entity';

@Injectable()
export class RemoveTeamUsecase {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async remove(teamId: string): Promise<any> {
    return this.teamsRepository.delete(teamId);
  }
} 