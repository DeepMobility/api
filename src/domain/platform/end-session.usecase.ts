import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from 'src/database/entities/session.entity';

@Injectable()
export class EndSessionUsecase {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  async end(
    sessionId: number,
    questionRating: number,
  ): Promise<any> {
    return this.sessionsRepository.save({
      id: sessionId,
      afterRating: questionRating
    });
  }
}
