import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EditUserUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async edit(
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    password?: string,
    gender?: string,
    birthYear?: number,
    hasDashboardAccess?: boolean
  ): Promise<UpdateResult> {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    return this.usersRepository.update(userId, {
      email,
      firstName,
      lastName,
      gender,
      birthYear,
      ...(hashedPassword && { hashedPassword }),
      ...(hasDashboardAccess !== undefined && { hasDashboardAccess })
    });
  }
}