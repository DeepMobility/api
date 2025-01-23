import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository, QueryFailedError } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from '../../database/entities/account.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class RegisterUsecase {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(
    accountHost: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    gender: string,
    birthYear: number
  ): Promise<any> {
    const account = await this.accountsRepository.findOne({ where: { host : accountHost } })

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const user = await this.usersRepository.save({
        account,
        email,
        hashedPassword,
        firstName,
        lastName,
        gender,
        birthYear
      });
  
      const jwt = await this.jwtService.signAsync({ userId: user.id }, { secret: process.env.JWT_SECRET });
  
      return { jwt };
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.startsWith("duplicate")) {
        throw new UnprocessableEntityException('user already exists');
      }

      throw error;
    }
  }
}
