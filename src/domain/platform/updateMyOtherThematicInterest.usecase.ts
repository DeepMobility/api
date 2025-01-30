import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class UpdateMyOtherThematicInterest {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async update(
    userId: string,
    thematic: string
  ): Promise<any> {
    return this.usersRepository.save({ id: userId, otherThematicInterest: thematic });
  }
}
