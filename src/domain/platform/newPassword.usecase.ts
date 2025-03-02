import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class NewPasswordUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async update(token: string, newPassword: string): Promise<any> {
    const payload = await this.jwtService.verifyAsync(
      token,
      { secret: process.env.JWT_SECRET }
    );

    if (new Date() > new Date(payload.validUntil)) {
      throw new ForbiddenException()
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    return this.usersRepository.save({ id: payload.userId, hashedPassword });
  }
}
