import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class LoginUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async login(accountHost: string, email: string, password: string): Promise<any> {
    if (!accountHost) {
      throw new BadRequestException()
    }
    
    const user = await this.usersRepository.findOne({
      relations: { account: true },
      where: {
        email,
        account: { host: accountHost }
      },
    })

    if (!user){
      throw new UnauthorizedException();
    }

    const passwordMatches = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatches) {
      throw new ForbiddenException();
    }

    const jwt = await this.jwtService.signAsync({ id: user.id }, { secret: process.env.JWT_SECRET });

    return {
      jwt,
      firstName: user.firstName,
      jobType: user.jobType,
      painfulBodyParts: user.painfulBodyParts,
      otherThematicInterests: user.otherThematicInterests,
    };
  }
}
