import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from 'src/database/entities/account.entity';

@Injectable()
export class RemoveAccountUsecase {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  //TODO: remove sub-domain from Scalingo
  remove(accountId: number): Promise<any> {
    return this.accountsRepository.delete(accountId);
  }
}
