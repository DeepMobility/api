import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class ChangePasswordUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordMatches = await bcrypt.compare(currentPassword, user.hashedPassword);

    if (!passwordMatches) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersRepository.update(userId, {
      hashedPassword,
    });
  }
}

