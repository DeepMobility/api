import { Injectable, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class LoginUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async login(accountHost: string, email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      relations: { account: true },
      where: {
        email,
        account: { host: 'localhost:3001' }
      },
    })

    if (!user){
      throw new UnauthorizedException();
    }

    if (!user.hasDashboardAccess) {
      throw new NotFoundException();
    }

    const passwordMatches = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatches) {
      throw new ForbiddenException();
    }

    const jwt = await this.jwtService.signAsync(
      { 
        id: user.id,
        accountId: user.account.id,
        isDashboard: true,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }, 
      { secret: process.env.JWT_SECRET }
    );

    return {
      jwt,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountId: user.account.id,
    };
  }
}

