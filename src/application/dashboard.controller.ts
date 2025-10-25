import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { Public } from './auth.decorator';
import { LoginUsecase } from '../domain/dashboard/login.usecase';
import { GetCompanyStatsUsecase } from '../domain/dashboard/getCompanyStats.usecase';
import { GetTeamStatsUsecase } from '../domain/dashboard/getTeamStats.usecase';
import { GetWellbeingStatsUsecase } from '../domain/dashboard/getWellbeingStats.usecase';
import { ChangePasswordUsecase } from '../domain/dashboard/changePassword.usecase';
import { GetAccountLogoUrlUsecase } from '../domain/platform/getAccountLogoUrl.usecase';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private loginUsecase: LoginUsecase,
    private getCompanyStatsUsecase: GetCompanyStatsUsecase,
    private getTeamStatsUsecase: GetTeamStatsUsecase,
    private getWellbeingStatsUsecase: GetWellbeingStatsUsecase,
    private changePasswordUsecase: ChangePasswordUsecase,
    private getAccountLogoUrlUsecase: GetAccountLogoUrlUsecase,
  ) {}

  @Public()
  @Get('get-account-logo-url/:accountHost')
  getAccountLogoUrl(@Param() params: any): Promise<any> {
    return this.getAccountLogoUrlUsecase.get(params.accountHost);
  }

  @Public()
  @Post('login')
  login(@Body() body: { email: string; password: string; accountHost: string }) {
    return this.loginUsecase.login(body.accountHost, body.email, body.password);
  }

  @Get('company-stats')
  getCompanyStats(
    @Req() request: any,
    @Query('period') period: 'day' | 'week' | 'month' = 'month'
  ) {
    const user = request.user;
    
    if (!user?.accountId || !user?.isDashboard) {
      throw new UnauthorizedException();
    }

    return this.getCompanyStatsUsecase.execute(user.accountId, period);
  }

  @Get('team-stats')
  getTeamStats(
    @Req() request: any,
    @Query('period') period: 'day' | 'week' | 'month' = 'month'
  ) {
    const user = request.user;
    
    if (!user?.accountId || !user?.isDashboard) {
      throw new UnauthorizedException();
    }

    return this.getTeamStatsUsecase.execute(user.accountId, period);
  }

  @Get('wellbeing-stats')
  getWellbeingStats(
    @Req() request: any,
    @Query('period') period: 'day' | 'week' | 'month' = 'month',
    @Query('teamId') teamId?: string
  ) {
    const user = request.user;
    
    if (!user?.accountId || !user?.isDashboard) {
      throw new UnauthorizedException();
    }

    return this.getWellbeingStatsUsecase.execute(user.accountId, period, teamId);
  }

  @Post('change-password')
  async changePassword(
    @Req() request: any,
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    const user = request.user;
    
    if (!user?.id || !user?.isDashboard) {
      throw new UnauthorizedException();
    }

    await this.changePasswordUsecase.changePassword(
      user.id,
      body.currentPassword,
      body.newPassword
    );

    return { success: true };
  }
}

