import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Team } from '../../database/entities/team.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class EditTeamUsecase {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async edit(
    teamId: string,
    name: string,
    description: string,
    memberIds: string[] = []
  ): Promise<Team> {
    const team = await this.teamsRepository.findOne({
      where: { id: teamId },
      relations: ['members']
    });

    if (!team) {
      throw new Error('Team not found');
    }

    team.name = name;
    team.description = description;

    const newMembers = memberIds.length > 0
      ? await this.usersRepository.findBy({ id: In(memberIds) })
      : [];

    team.members = newMembers;

    return this.teamsRepository.save(team);
  }
} 