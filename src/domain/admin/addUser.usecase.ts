import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AddUserUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async add(
    accountId: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    gender: string,
    birthYear: number,
    hasDashboardAccess?: boolean,
    isAdmin?: boolean
  ): Promise<User> {
    const hashedPassword = bcrypt.hashSync(password, 10);

    return this.usersRepository.save({
      account: {
        id: accountId
      },
      email,
      hashedPassword,
      firstName,
      lastName,
      gender,
      birthYear,
      hasDashboardAccess: hasDashboardAccess || false,
      isAdmin: isAdmin || false
    });
  }
}
