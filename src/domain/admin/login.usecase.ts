import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginUsecase {
  constructor(
    private jwtService: JwtService
  ) {}

  async login(email: string, password: string): Promise<any> {
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      throw new UnauthorizedException();
    }

    const jwt = await this.jwtService.signAsync({ isAdmin: true }, { secret: process.env.JWT_SECRET });

    return { jwt }
  }
}
