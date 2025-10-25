import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../../database/entities/user.entity';
import { Session } from '../../database/entities/session.entity';
import { Video } from '../../database/entities/video.entity';
import { Team } from '../../database/entities/team.entity';
import { LoginUsecase } from './login.usecase';
import { GetCompanyStatsUsecase } from './getCompanyStats.usecase';
import { GetTeamStatsUsecase } from './getTeamStats.usecase';
import { GetWellbeingStatsUsecase } from './getWellbeingStats.usecase';
import { ChangePasswordUsecase } from './changePassword.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session, Video, Team]),
    JwtModule.register({}),
  ],
  providers: [
    LoginUsecase,
    GetCompanyStatsUsecase,
    GetTeamStatsUsecase,
    GetWellbeingStatsUsecase,
    ChangePasswordUsecase,
  ],
  exports: [
    LoginUsecase,
    GetCompanyStatsUsecase,
    GetTeamStatsUsecase,
    GetWellbeingStatsUsecase,
    ChangePasswordUsecase,
  ],
})
export class DashboardModule {}

