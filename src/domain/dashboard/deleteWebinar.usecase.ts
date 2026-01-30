import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Webinar } from '../../database/entities/webinar.entity';

@Injectable()
export class DeleteWebinarUsecase {
  constructor(
    @InjectRepository(Webinar)
    private webinarRepository: Repository<Webinar>,
  ) {}

  async execute(accountId: string, webinarId: string): Promise<void> {
    const webinar = await this.webinarRepository.findOne({
      where: { id: webinarId, accountId },
    });

    if (!webinar) {
      throw new NotFoundException('Webinar not found');
    }

    await this.webinarRepository.remove(webinar);
  }
}
