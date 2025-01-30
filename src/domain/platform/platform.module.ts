import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../database/entities/account.entity';
import { User } from '../../database/entities/user.entity';
import { Video } from '../../database/entities/video.entity';
import { LoginUsecase } from './login.usecase';
import { RegisterUsecase } from './register.usecase';
import { UpdateMyJobTypeUsecase } from './updateMyJobType.usecase';
import { UpdateMyOtherThematicInterest } from './updateMyOtherThematicInterest.usecase';
import { UpdateMyPainfulBodyPart } from './updateMyPainfulBodyPart.usecase';
import { GetMyDashboardUsecase } from './getMyDashboard.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User, Video])],
  providers: [
    LoginUsecase,
    RegisterUsecase,
    UpdateMyJobTypeUsecase,
    UpdateMyOtherThematicInterest,
    UpdateMyPainfulBodyPart,
    GetMyDashboardUsecase,
  ],
  exports: [
    LoginUsecase,
    RegisterUsecase,
    UpdateMyJobTypeUsecase,
    UpdateMyOtherThematicInterest,
    UpdateMyPainfulBodyPart,
    GetMyDashboardUsecase,
  ]
})
export class PlatformModule {}
