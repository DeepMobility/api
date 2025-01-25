import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../database/entities/account.entity';
import { User } from '../../database/entities/user.entity';
import { LoginUsecase } from './login.usecase';
import { RegisterUsecase } from './register.usecase';
import { UpdateUserJobTypeUsecase } from './updateUserJobType.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  providers: [
    LoginUsecase,
    RegisterUsecase,
    UpdateUserJobTypeUsecase,
  ],
  exports: [
    LoginUsecase,
    RegisterUsecase,
    UpdateUserJobTypeUsecase,
  ]
})
export class PlatformModule {}
