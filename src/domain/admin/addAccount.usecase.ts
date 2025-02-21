import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../database/entities/account.entity';

@Injectable()
export class AddAccountUsecase {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  add(name: string, slug: string, host: string, logoUrl: string): Promise<any> {
    return this.accountsRepository.save({ name, slug, host, logoUrl });
  }
}
