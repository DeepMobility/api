import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class AnswerSurveyUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async answer(
    userId: string,
    survey: [{
      question: string,
      answer: string
    }]
  ): Promise<any> {
    return this.usersRepository.save({ id: userId, survey });
  }
}
