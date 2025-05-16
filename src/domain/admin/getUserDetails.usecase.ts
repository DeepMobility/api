import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class GetUserDetailsUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async get(userId: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { id: userId },
      relations: ['teams']
    });
  }
} 