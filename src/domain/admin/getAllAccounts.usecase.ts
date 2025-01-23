import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../database/entities/account.entity';

@Injectable()
export class GetAllAccountsUsecase {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  getAll(): Promise<any[]> {
    return this.accountsRepository.find();
  }
}
