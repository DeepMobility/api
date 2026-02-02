import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, AccountConfiguration } from '../../database/entities/account.entity';

export interface AccountInfo {
  logoUrl: string | null;
  webinarsEnabled: boolean;
}

@Injectable()
export class GetAccountUsecase {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async execute(accountId: string): Promise<AccountInfo> {
    const account = await this.accountsRepository.findOne({
      where: { id: accountId },
    });

    const config: AccountConfiguration = account?.configuration ?? {};

    return {
      logoUrl: account?.logoUrl || null,
      webinarsEnabled: config.webinarsEnabled ?? false,
    };
  }
}
