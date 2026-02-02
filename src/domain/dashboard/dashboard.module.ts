import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../../database/entities/user.entity';
import { Session } from '../../database/entities/session.entity';
import { Video } from '../../database/entities/video.entity';
import { Team } from '../../database/entities/team.entity';
import { Account } from '../../database/entities/account.entity';
import { Webinar } from '../../database/entities/webinar.entity';
import { LoginUsecase } from './login.usecase';
import { GetCompanyStatsUsecase } from './getCompanyStats.usecase';
import { GetTeamStatsUsecase } from './getTeamStats.usecase';
import { GetWellbeingStatsUsecase } from './getWellbeingStats.usecase';
import { ChangePasswordUsecase } from './changePassword.usecase';
import { GetAccountLogoUrlUsecase } from '../platform/getAccountLogoUrl.usecase';
import { InviteUsersUsecase } from './inviteUsers.usecase';
import { GetUsersUsecase } from './getUsers.usecase';
import { DeleteUsersUsecase } from './deleteUsers.usecase';
import { AddWebinarUsecase } from './addWebinar.usecase';
import { GetWebinarsUsecase } from './getWebinars.usecase';
import { DeleteWebinarUsecase } from './deleteWebinar.usecase';
import { UpdateWebinarUsecase } from './updateWebinar.usecase';
import { SendWebinarReminderUsecase } from './sendWebinarReminder.usecase';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session, Video, Team, Account, Webinar]),
    JwtModule.register({}),
    SharedModule,
  ],
  providers: [
    LoginUsecase,
    GetCompanyStatsUsecase,
    GetTeamStatsUsecase,
    GetWellbeingStatsUsecase,
    ChangePasswordUsecase,
    GetAccountLogoUrlUsecase,
    InviteUsersUsecase,
    GetUsersUsecase,
    DeleteUsersUsecase,
    AddWebinarUsecase,
    GetWebinarsUsecase,
    DeleteWebinarUsecase,
    UpdateWebinarUsecase,
    SendWebinarReminderUsecase,
  ],
  exports: [
    LoginUsecase,
    GetCompanyStatsUsecase,
    GetTeamStatsUsecase,
    GetWellbeingStatsUsecase,
    ChangePasswordUsecase,
    GetAccountLogoUrlUsecase,
    InviteUsersUsecase,
    GetUsersUsecase,
    DeleteUsersUsecase,
    AddWebinarUsecase,
    GetWebinarsUsecase,
    DeleteWebinarUsecase,
    UpdateWebinarUsecase,
    SendWebinarReminderUsecase,
  ],
})
export class DashboardModule {}

