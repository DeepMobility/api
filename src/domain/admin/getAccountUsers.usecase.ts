import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class GetAccountUsersUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async get(accountId: string): Promise<User[]> {
    return this.usersRepository.find({
      where: {
        account: {
          id: accountId,
        },
      },
      relations: ['account'],
      order: {
        createdAt: 'DESC',
      },
    });
  }
} 