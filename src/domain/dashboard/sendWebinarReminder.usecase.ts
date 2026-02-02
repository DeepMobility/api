import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Webinar } from '../../database/entities/webinar.entity';
import { User } from '../../database/entities/user.entity';
import { EmailService } from '../shared/email/email.service';

@Injectable()
export class SendWebinarReminderUsecase {
  constructor(
    @InjectRepository(Webinar)
    private webinarRepository: Repository<Webinar>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async execute(accountId: string, webinarId: string): Promise<{ sentCount: number }> {
    const webinar = await this.webinarRepository.findOne({
      where: { id: webinarId },
    });

    if (!webinar) {
      throw new NotFoundException('Webinar not found');
    }

    if (webinar.accountId !== accountId) {
      throw new ForbiddenException('You do not have access to this webinar');
    }

    // Get all active users for this account
    const users = await this.userRepository.find({
      where: { 
        account: { id: accountId },
        isAdmin: false,
      },
      select: ['email', 'firstName'],
    });

    // Format the webinar date
    const webinarDate = new Date(webinar.scheduledAt).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Send email to each user
    let sentCount = 0;
    for (const user of users) {
      try {
        await this.emailService.sendEmail({
          to: user.email,
          subject: `Rappel : ${webinar.title}`,
          template: 'webinarReminder',
          variables: {
            webinarTitle: webinar.title,
            webinarDate: webinarDate,
            webinarLink: webinar.registrationLink || webinar.teamsLink,
          },
        });
        sentCount++;
      } catch (error) {
        console.error(`Failed to send reminder to ${user.email}:`, error);
      }
    }

    return { sentCount };
  }
}
