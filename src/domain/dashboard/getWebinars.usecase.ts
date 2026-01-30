import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Webinar } from '../../database/entities/webinar.entity';

@Injectable()
export class GetWebinarsUsecase {
  constructor(
    @InjectRepository(Webinar)
    private webinarRepository: Repository<Webinar>,
  ) {}

  async execute(accountId: string): Promise<Webinar[]> {
    return this.webinarRepository.find({
      where: { accountId },
      order: { scheduledAt: 'DESC' },
    });
  }
}
