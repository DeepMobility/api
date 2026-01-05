import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class CompleteInvitationUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async complete(
    token: string,
    password: string,
    firstName: string,
    lastName: string,
    gender: string,
    birthYear: number
  ): Promise<any> {
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

      // Find the invited user
      const user = await this.usersRepository.findOne({
        where: { id: decoded.userId },
        relations: ['account']
      });

      if (!user || !user.invitedAt || user.confirmedAt || user.deletedAt) {
        throw new UnauthorizedException('Invalid invitation');
      }

      // Update user with complete information
      const hashedPassword = bcrypt.hashSync(password, 10);
      
      user.hashedPassword = hashedPassword;
      user.firstName = firstName;
      user.lastName = lastName;
      user.gender = gender;
      user.birthYear = birthYear;
      user.confirmedAt = new Date();

      await this.usersRepository.save(user);

      // Generate autologin token
      const autologinValidUntil = new Date();
      autologinValidUntil.setHours(autologinValidUntil.getHours() + 24);

      const autologinToken = await this.jwtService.signAsync(
        { userId: user.id, validUntil: autologinValidUntil, purpose: 'registration' }, 
        { secret: process.env.JWT_SECRET }
      );

      const http = user.account.host.startsWith("localhost") ? "http://" : "https://";
      const redirectUrl = `${http}${user.account.host}/auth/autologin?token=${autologinToken}&purpose=registration`;

      return { 
        success: true,
        redirectUrl,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Failed to complete invitation');
    }
  }
}

