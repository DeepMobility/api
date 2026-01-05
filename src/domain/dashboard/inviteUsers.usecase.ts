import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository, In } from 'typeorm';
import { Account } from '../../database/entities/account.entity';
import { User } from '../../database/entities/user.entity';
import { EmailService } from '../shared/email/email.service';

@Injectable()
export class InviteUsersUsecase {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async execute(accountId: string, emails: string[]): Promise<{ invited: number; errors: string[] }> {
    const account = await this.accountsRepository.findOne({ 
      where: { id: accountId } 
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const errors: string[] = [];
    let invited = 0;

    for (const email of emails) {
      try {
        // Validate email format
        if (!email || !email.includes('@')) {
          errors.push(`${email}: format d'email invalide`);
          continue;
        }

        const emailNormalized = email.toLowerCase().trim();

        // Check domain restrictions
        const emailDomain = emailNormalized.split('@')[1];
        const isAllowedDomain = account.allowedDomains.length === 0 || 
                               account.allowedDomains.some(domain => domain.toLowerCase() === emailDomain.toLowerCase());

        if (!isAllowedDomain) {
          errors.push(`${email}: domaine non autorisé`);
          continue;
        }

        // Check if user already exists (including soft-deleted)
        const existingUser = await this.usersRepository.findOne({
          where: { account: { id: accountId }, email: emailNormalized }
        });

        if (existingUser && !existingUser.deletedAt) {
          // User exists and is active
          if (existingUser.confirmedAt) {
            errors.push(`${email}: utilisateur déjà inscrit`);
          } else {
            errors.push(`${email}: invitation déjà envoyée`);
          }
          continue;
        }

        let user: User;

        if (existingUser && existingUser.deletedAt) {
          // Restore soft-deleted user
          existingUser.deletedAt = null;
          existingUser.invitedAt = new Date();
          user = await this.usersRepository.save(existingUser);
        } else {
          // Create new invited user with a temporary password
          const tempPassword = Math.random().toString(36).slice(-12);
          const bcrypt = require('bcrypt');
          const hashedPassword = bcrypt.hashSync(tempPassword, 10);

          user = await this.usersRepository.save({
            account,
            email: emailNormalized,
            hashedPassword,
            invitedAt: new Date(),
          });
        }

        // Generate invitation token (valid for 7 days)
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 7);

        const invitationToken = await this.jwtService.signAsync(
          { userId: user.id, email: emailNormalized, validUntil, purpose: 'invitation' }, 
          { secret: process.env.JWT_SECRET }
        );

        const http = account.host.startsWith("localhost") ? "http://" : "https://";
        const invitationUrl = `${http}${account.host}/auth/invitation?token=${invitationToken}`;

        // Send invitation email
        await this.emailService.sendEmail({
          to: emailNormalized,
          subject: "Vous êtes invité à rejoindre DeepMobility",
          template: 'userInvitation',
          variables: {
            accountName: account.name,
            invitationUrl,
          },
        });

        invited++;
      } catch (error) {
        console.error(`Error inviting ${email}:`, error);
        errors.push(`${email}: erreur lors de l'invitation`);
      }
    }

    return { invited, errors };
  }
}

