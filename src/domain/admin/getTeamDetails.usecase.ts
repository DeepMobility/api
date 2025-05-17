import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../database/entities/team.entity';

@Injectable()
export class GetTeamDetailsUsecase {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async get(teamId: string): Promise<Team> {
    return this.teamsRepository.findOne({
      where: { id: teamId },
      relations: ['members']
    });
  }
} 