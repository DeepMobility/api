import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Webinar } from '../../database/entities/webinar.entity';

export interface UpdateWebinarData {
  title?: string;
  scheduledAt?: Date;
  teamsLink?: string;
  registrationLink?: string | null;
  isActive?: boolean;
}

@Injectable()
export class UpdateWebinarUsecase {
  constructor(
    @InjectRepository(Webinar)
    private webinarRepository: Repository<Webinar>,
  ) {}

  async execute(
    accountId: string,
    webinarId: string,
    data: UpdateWebinarData,
  ): Promise<Webinar> {
    const webinar = await this.webinarRepository.findOne({
      where: { id: webinarId },
    });

    if (!webinar) {
      throw new NotFoundException('Webinar not found');
    }

    if (webinar.accountId !== accountId) {
      throw new ForbiddenException('You do not have access to this webinar');
    }

    Object.assign(webinar, data);

    return this.webinarRepository.save(webinar);
  }
}
