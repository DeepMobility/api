import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Account, AccountConfiguration } from '../../database/entities/account.entity';

@Injectable()
export class EditAccountUsecase {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async edit(
    accountId: string,
    allowedDomains: string,
    configuration?: Partial<AccountConfiguration>
  ): Promise<UpdateResult> {
    const allowedDomainsArray = allowedDomains.split(',').map(domain => domain.trim()).filter(domain => domain !== '');
    
    const updateData: Partial<Account> = {
      allowedDomains: allowedDomainsArray
    };

    if (configuration) {
      const account = await this.accountsRepository.findOne({ where: { id: accountId } });
      updateData.configuration = {
        ...account?.configuration,
        ...configuration
      };
    }

    return this.accountsRepository.update(accountId, updateData);
  }
}