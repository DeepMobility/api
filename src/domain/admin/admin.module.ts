import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../database/entities/account.entity';
import { User } from '../../database/entities/user.entity';
import { LoginUsecase } from './login.usecase';
import { GetAllAccountsUsecase } from './getAllAccounts.usecase';
import { AddAccountUsecase } from './addAccount.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  providers: [
    LoginUsecase,
    AddAccountUsecase,
    GetAllAccountsUsecase
  ],
  exports: [
    LoginUsecase,
    AddAccountUsecase,
    GetAllAccountsUsecase
  ]
})
export class AdminModule {}
