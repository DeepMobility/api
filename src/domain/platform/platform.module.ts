import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../database/entities/account.entity';
import { Challenge } from '../../database/entities/challenge.entity';
import { User } from '../../database/entities/user.entity';
import { Video } from '../../database/entities/video.entity';
import { LoginUsecase } from './login.usecase';
import { RegisterUsecase } from './register.usecase';
import { UpdateMyJobTypeUsecase } from './updateMyJobType.usecase';
import { UpdateMyOtherThematicInterests } from './updateMyOtherThematicInterests.usecase';
import { UpdateMyPainfulBodyParts } from './updateMyPainfulBodyParts.usecase';
import { GetMyDashboardUsecase } from './getMyDashboard.usecase';
import { StartSessionUsecase } from './startSession.usecase';
import { EndSessionUsecase } from './endSession.usecase';
import { Session } from 'src/database/entities/session.entity';
import { GetAccountLogoUrlUsecase } from './getAccountLogoUrl.usecase';
import { ResetPasswordUsecase } from './resetPassword.usecase';
import { NewPasswordUsecase } from './newPassword.usecase';
import { AnswerSurveyUsecase } from './answerSurvey.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User, Video, Session, Challenge])],
  providers: [
    GetAccountLogoUrlUsecase,
    LoginUsecase,
    RegisterUsecase,
    ResetPasswordUsecase,
    NewPasswordUsecase,
    UpdateMyJobTypeUsecase,
    UpdateMyOtherThematicInterests,
    UpdateMyPainfulBodyParts,
    GetMyDashboardUsecase,
    StartSessionUsecase,
    EndSessionUsecase,
    AnswerSurveyUsecase,
  ],
  exports: [
    GetAccountLogoUrlUsecase,
    LoginUsecase,
    RegisterUsecase,
    ResetPasswordUsecase,
    NewPasswordUsecase,
    UpdateMyJobTypeUsecase,
    UpdateMyOtherThematicInterests,
    UpdateMyPainfulBodyParts,
    GetMyDashboardUsecase,
    StartSessionUsecase,
    EndSessionUsecase,
    AnswerSurveyUsecase,
  ]
})
export class PlatformModule {}
