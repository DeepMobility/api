import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Account } from '../../database/entities/account.entity';

@Injectable()
export class EditAccountUsecase {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async edit(
    accountId: string,
    allowedDomains: string
  ): Promise<UpdateResult> {
    const allowedDomainsArray = allowedDomains.split(',').map(domain => domain.trim()).filter(domain => domain !== '').filter(domain => domain !== '');
    console.log(allowedDomainsArray);
    return this.accountsRepository.update(accountId, {
      allowedDomains: allowedDomainsArray
    });
  }
}