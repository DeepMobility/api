import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class UpdateMyPainfulBodyParts {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async update(
    userId: string,
    bodyParts: string[]
  ): Promise<any> {
    return this.usersRepository.save({ id: userId, painfulBodyParts: bodyParts });
  }
}
