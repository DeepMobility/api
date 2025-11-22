import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { EmailService } from '../shared/email/email.service';

@Injectable()
export class ResendConfirmationUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async resend(accountHost: string, email: string): Promise<any> {
    if (!accountHost) {
      throw new BadRequestException();
    }

    const user = await this.usersRepository.findOne({
      relations: { account: true },
      where: {
        email,
        account: { host: accountHost }
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (user.confirmedAt) {
      throw new BadRequestException('email already confirmed');
    }

    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + 24);

    const autologinToken = await this.jwtService.signAsync(
      { userId: user.id, validUntil, purpose: 'registration' }, 
      { secret: process.env.JWT_SECRET }
    );

    const http = accountHost.startsWith("localhost") ? "http://" : "https://";
    const confirmationUrl = `${http}${accountHost}/auth/autologin?token=${autologinToken}&purpose=registration`;

    await this.emailService.sendEmail({
      to: email,
      subject: "Confirmez votre inscription à DeepMobility",
      template: 'registrationConfirmation',
      variables: {
        firstName: user.firstName || '',
        confirmationUrl,
      },
    });

    return { sent: true };
  }
}

