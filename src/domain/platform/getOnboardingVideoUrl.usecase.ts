import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class GetOnboardingVideoUrlUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async get(userId: string): Promise<{ onboardingVideoUrl: string | null }> {
    const user = await this.usersRepository.findOne({
      relations: { account: true },
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      onboardingVideoUrl: user.account.configuration?.onboardingVideoUrl || null,
    };
  }
}
