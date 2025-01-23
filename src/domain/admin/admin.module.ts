import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../database/entities/account.entity';
import { User } from '../../database/entities/user.entity';
import { Video } from '../../database/entities/video.entity';
import { LoginUsecase } from './login.usecase';
import { GetAllAccountsUsecase } from './getAllAccounts.usecase';
import { AddAccountUsecase } from './addAccount.usecase';
import { GetAllVideosUsecase } from './getAllVideos.usecase';
import { AddVideoUsecase } from './addVideo.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User, Video])],
  providers: [
    LoginUsecase,
    AddAccountUsecase,
    GetAllAccountsUsecase,
    GetAllVideosUsecase,
    AddVideoUsecase
  ],
  exports: [
    LoginUsecase,
    AddAccountUsecase,
    GetAllAccountsUsecase,
    GetAllVideosUsecase,
    AddVideoUsecase
  ]
})
export class AdminModule {}
