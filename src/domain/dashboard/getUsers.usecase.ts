import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class GetUsersUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async execute(accountId: string): Promise<any[]> {
    const users = await this.usersRepository.find({
      where: { 
        account: { id: accountId },
        deletedAt: IsNull()
      },
      order: {
        createdAt: 'DESC'
      }
    });

    return users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      confirmedAt: user.confirmedAt,
      invitedAt: user.invitedAt,
      isInvited: !!user.invitedAt && !user.confirmedAt,
      isActive: !!user.confirmedAt,
    }));
  }
}

