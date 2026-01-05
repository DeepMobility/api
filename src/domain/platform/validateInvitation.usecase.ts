import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class ValidateInvitationUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validate(token: string): Promise<{ email: string; userId: string }> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      if (decoded.purpose !== 'invitation') {
        throw new UnauthorizedException('Invalid token purpose');
      }

      const validUntil = new Date(decoded.validUntil);
      if (validUntil < new Date()) {
        throw new UnauthorizedException('Token expired');
      }

      // Verify user exists and is invited
      const user = await this.usersRepository.findOne({
        where: { id: decoded.userId }
      });

      if (!user || !user.invitedAt || user.confirmedAt || user.deletedAt) {
        throw new UnauthorizedException('Invalid invitation');
      }

      return {
        email: decoded.email,
        userId: decoded.userId,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

