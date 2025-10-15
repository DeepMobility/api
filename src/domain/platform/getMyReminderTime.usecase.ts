import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class GetMyReminderTimeUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async get(userId: string): Promise<{ reminderTime: string | null }> {
    const user = await this.usersRepository.findOne({ 
      where: { id: userId },
      select: ['reminderTime']
    });
    
    return { reminderTime: user?.reminderTime || null };
  }
}

