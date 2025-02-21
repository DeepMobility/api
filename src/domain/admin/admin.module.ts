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
import { RemoveVideoUsecase } from './removeVideo.usecase';
import { RemoveAccountUsecase } from './removeAccount.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User, Video])],
  providers: [
    LoginUsecase,
    AddAccountUsecase,
    RemoveAccountUsecase,
    GetAllAccountsUsecase,
    GetAllVideosUsecase,
    AddVideoUsecase,
    RemoveVideoUsecase
  ],
  exports: [
    LoginUsecase,
    AddAccountUsecase,
    RemoveAccountUsecase,
    GetAllAccountsUsecase,
    GetAllVideosUsecase,
    AddVideoUsecase,
    RemoveVideoUsecase
  ]
})
export class AdminModule {}
