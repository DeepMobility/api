import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class AutologinUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async autologin(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      });

      const validUntil = new Date(payload.validUntil);
      if (validUntil < new Date()) {
        throw new UnauthorizedException('token expired');
      }

      const user = await this.usersRepository.findOne({
        relations: { account: true },
        where: { id: payload.userId }
      });

      if (!user) {
        throw new UnauthorizedException('user not found');
      }

      if (payload.purpose === 'registration' && !user.confirmedAt) {
        await this.usersRepository.update(user.id, {
          confirmedAt: new Date()
        });
      }

      const jwt = await this.jwtService.signAsync(
        { id: user.id }, 
        { secret: process.env.JWT_SECRET }
      );

      return {
        jwt,
        firstName: user.firstName,
        jobType: user.jobType,
        painfulBodyParts: user.painfulBodyParts,
        otherThematicInterests: user.otherThematicInterests,
        purpose: payload.purpose,
      };
    } catch (error) {
      throw new UnauthorizedException('invalid token');
    }
  }
}

