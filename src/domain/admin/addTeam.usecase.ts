import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Team } from '../../database/entities/team.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class AddTeamUsecase {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async add(
    accountId: string,
    name: string,
    description: string,
    memberIds: string[] = []
  ): Promise<Team> {
    const members = memberIds.length > 0
      ? await this.usersRepository.findBy({ id: In(memberIds) })
      : [];

    return this.teamsRepository.save({
      account: {
        id: accountId
      },
      name,
      description,
      members
    });
  }
}