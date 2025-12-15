import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { EmailService } from '../shared/email/email.service';

@Injectable()
export class ResetPasswordUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async reset(accountHost: string, email: string): Promise<any> {
    if (!accountHost) {
      throw new BadRequestException()
    }

    const user = await this.usersRepository.findOne({
      relations: { account: true },
      where: {
        email,
        account: { host: accountHost }
      },
    })

    if (user) {
      const validUntil = new Date();
      validUntil.setHours(validUntil.getHours() + 1);

      const token = await this.jwtService.signAsync(
        { userId: user.id, validUntil, purpose: 'password-reset' }, 
        { secret: process.env.JWT_SECRET }
      );

      const http = accountHost.startsWith("localhost") ? "http://" : "https://";
      const resetUrl = `${http}${accountHost}/auth/nouveau-mot-de-passe?token=${token}&purpose=password-reset`;

      await this.emailService.sendEmail({
        to: email,
        subject: "Réinitialisation de mot de passe",
        template: 'passwordReset',
        variables: {
          resetUrl,
        },
      });
    }

    return {};
  }
}
