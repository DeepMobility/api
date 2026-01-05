import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class DeleteUsersUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async execute(accountId: string, userIds: string[]): Promise<{ deleted: number }> {
    if (!userIds || userIds.length === 0) {
      throw new BadRequestException('No user IDs provided');
    }

    // Find users belonging to this account
    const users = await this.usersRepository.find({
      where: { 
        id: In(userIds),
        account: { id: accountId }
      }
    });

    if (users.length === 0) {
      throw new BadRequestException('No users found');
    }

    // Soft delete users
    const now = new Date();
    for (const user of users) {
      user.deletedAt = now;
    }

    await this.usersRepository.save(users);

    return { deleted: users.length };
  }
}

