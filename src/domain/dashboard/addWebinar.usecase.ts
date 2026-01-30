import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Webinar } from '../../database/entities/webinar.entity';

@Injectable()
export class AddWebinarUsecase {
  constructor(
    @InjectRepository(Webinar)
    private webinarRepository: Repository<Webinar>,
  ) {}

  async execute(
    accountId: string,
    title: string,
    scheduledAt: Date,
    teamsLink: string,
    registrationLink?: string,
  ): Promise<Webinar> {
    const webinar = this.webinarRepository.create({
      accountId,
      title,
      scheduledAt,
      teamsLink,
      registrationLink,
      isActive: true,
    });

    return this.webinarRepository.save(webinar);
  }
}
