import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { Account } from '../../database/entities/account.entity';
import { Challenge } from '../../database/entities/challenge.entity';
import { User } from '../../database/entities/user.entity';
import { Video } from '../../database/entities/video.entity';
import { Webinar } from '../../database/entities/webinar.entity';
import { LoginUsecase } from './login.usecase';
import { RegisterUsecase } from './register.usecase';
import { AutologinUsecase } from './autologin.usecase';
import { ResendConfirmationUsecase } from './resendConfirmation.usecase';
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
import { UpdateMyReminderTimeUsecase } from './updateMyReminderTime.usecase';
import { GetMyReminderTimeUsecase } from './getMyReminderTime.usecase';
import { ValidateInvitationUsecase } from './validateInvitation.usecase';
import { CompleteInvitationUsecase } from './completeInvitation.usecase';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, User, Video, Session, Challenge, Webinar]),
    JwtModule.register({}),
    SharedModule,
  ],
  providers: [
    GetAccountLogoUrlUsecase,
    LoginUsecase,
    RegisterUsecase,
    AutologinUsecase,
    ResendConfirmationUsecase,
    ResetPasswordUsecase,
    NewPasswordUsecase,
    UpdateMyJobTypeUsecase,
    UpdateMyOtherThematicInterests,
    UpdateMyPainfulBodyParts,
    GetMyDashboardUsecase,
    StartSessionUsecase,
    EndSessionUsecase,
    AnswerSurveyUsecase,
    UpdateMyReminderTimeUsecase,
    GetMyReminderTimeUsecase,
    ValidateInvitationUsecase,
    CompleteInvitationUsecase,
  ],
  exports: [
    GetAccountLogoUrlUsecase,
    LoginUsecase,
    RegisterUsecase,
    AutologinUsecase,
    ResendConfirmationUsecase,
    ResetPasswordUsecase,
    NewPasswordUsecase,
    UpdateMyJobTypeUsecase,
    UpdateMyOtherThematicInterests,
    UpdateMyPainfulBodyParts,
    GetMyDashboardUsecase,
    StartSessionUsecase,
    EndSessionUsecase,
    AnswerSurveyUsecase,
    UpdateMyReminderTimeUsecase,
    GetMyReminderTimeUsecase,
    ValidateInvitationUsecase,
    CompleteInvitationUsecase,
  ]
})
export class PlatformModule {}
