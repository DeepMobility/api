import { Injectable, UnprocessableEntityException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository, QueryFailedError } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Account } from '../../database/entities/account.entity';
import { User } from '../../database/entities/user.entity';
import { EmailService } from '../shared/email/email.service';

@Injectable()
export class RegisterUsecase {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
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

    if (!account) {
      throw new ForbiddenException('account not found');
    }

    const emailDomain = email.split('@')[1];
    const isAllowedDomain = account.allowedDomains.length === 0 || 
                           account.allowedDomains.some(domain => domain.toLowerCase() === emailDomain.toLowerCase());

    if (!isAllowedDomain) {
      throw new ForbiddenException('user not allowed');
    }

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
          firstName: firstName || '',
          confirmationUrl,
        },
      });
  
      return { emailSent: true };
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.startsWith("duplicate")) {
        throw new UnprocessableEntityException('user already exists');
      }

      throw error;
    }
  }
}
