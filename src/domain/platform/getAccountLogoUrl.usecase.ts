import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from 'src/database/entities/account.entity';

@Injectable()
export class GetAccountLogoUrlUsecase {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async get(
    accountHost: string,
  ): Promise<any> {
    const account = await this.accountsRepository.findOneBy({ host: accountHost });

    return {
      logoUrl: account.logoUrl
    };
  }
}
