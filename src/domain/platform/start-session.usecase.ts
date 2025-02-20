import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from 'src/database/entities/session.entity';

@Injectable()
export class StartSessionUsecase {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  async start(
    userId: string,
    videoId: number,
    question: string,
    questionRating: number,
  ): Promise<any> {
    return this.sessionsRepository.save({
      user: { id: userId },
      video: { id: videoId },
      question,
      beforeRating: questionRating
    });
  }
}
