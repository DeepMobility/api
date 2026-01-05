import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../../database/entities/user.entity';
import { Session } from '../../database/entities/session.entity';
import { Video } from '../../database/entities/video.entity';
import { Team } from '../../database/entities/team.entity';
import { Account } from '../../database/entities/account.entity';
import { LoginUsecase } from './login.usecase';
import { GetCompanyStatsUsecase } from './getCompanyStats.usecase';
import { GetTeamStatsUsecase } from './getTeamStats.usecase';
import { GetWellbeingStatsUsecase } from './getWellbeingStats.usecase';
import { ChangePasswordUsecase } from './changePassword.usecase';
import { GetAccountLogoUrlUsecase } from '../platform/getAccountLogoUrl.usecase';
import { InviteUsersUsecase } from './inviteUsers.usecase';
import { GetUsersUsecase } from './getUsers.usecase';
import { DeleteUsersUsecase } from './deleteUsers.usecase';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session, Video, Team, Account]),
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
  ],
})
export class DashboardModule {}

