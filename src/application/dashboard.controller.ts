import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { InviteUsersUsecase } from '../domain/dashboard/inviteUsers.usecase';
import { GetUsersUsecase } from '../domain/dashboard/getUsers.usecase';
import { DeleteUsersUsecase } from '../domain/dashboard/deleteUsers.usecase';
import { AddWebinarUsecase } from '../domain/dashboard/addWebinar.usecase';
import { GetWebinarsUsecase } from '../domain/dashboard/getWebinars.usecase';
import { DeleteWebinarUsecase } from '../domain/dashboard/deleteWebinar.usecase';
import { UpdateWebinarUsecase } from '../domain/dashboard/updateWebinar.usecase';
import { GetAccountDetailsUsecase } from '../domain/dashboard/getAccountDetails.usecase';
import { SendWebinarReminderUsecase } from '../domain/dashboard/sendWebinarReminder.usecase';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private loginUsecase: LoginUsecase,
    private getCompanyStatsUsecase: GetCompanyStatsUsecase,
    private getTeamStatsUsecase: GetTeamStatsUsecase,
    private getWellbeingStatsUsecase: GetWellbeingStatsUsecase,
    private changePasswordUsecase: ChangePasswordUsecase,
    private getAccountLogoUrlUsecase: GetAccountLogoUrlUsecase,
    private inviteUsersUsecase: InviteUsersUsecase,
    private getUsersUsecase: GetUsersUsecase,
    private deleteUsersUsecase: DeleteUsersUsecase,
    private addWebinarUsecase: AddWebinarUsecase,
    private getWebinarsUsecase: GetWebinarsUsecase,
    private deleteWebinarUsecase: DeleteWebinarUsecase,
    private updateWebinarUsecase: UpdateWebinarUsecase,
    private getAccountDetailsUsecase: GetAccountDetailsUsecase,
    private sendWebinarReminderUsecase: SendWebinarReminderUsecase,
  ) {}

  @Public()
  @Get('get-account-logo-url/:accountHost')
  getAccountLogoUrl(@Param() params: any): Promise<any> {
    const actualAccountHost = params.accountHost.replace('.dashboard', '');
    return this.getAccountLogoUrlUsecase.get(actualAccountHost);
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

  @Get('users')
  async getUsers(@Req() request: any) {
    const user = request.user;
    
    if (!user?.accountId || !user?.isDashboard) {
      throw new UnauthorizedException();
    }

    return this.getUsersUsecase.execute(user.accountId);
  }

  @Post('invite-users')
  async inviteUsers(
    @Req() request: any,
    @Body() body: { emails: string[] }
  ) {
    const user = request.user;
    
    if (!user?.accountId || !user?.isDashboard) {
      throw new UnauthorizedException();
    }

    return this.inviteUsersUsecase.execute(user.accountId, body.emails);
  }

  @Delete('users')
  async deleteUsers(
    @Req() request: any,
    @Body() body: { userIds: string[] }
  ) {
    const user = request.user;
    
    if (!user?.accountId || !user?.isDashboard) {
      throw new UnauthorizedException();
    }

    return this.deleteUsersUsecase.execute(user.accountId, body.userIds);
  }

  @Get('webinars')
  async getWebinars(@Req() request: any) {
    const user = request.user;
    
    if (!user?.accountId || !user?.isDashboard) {
      throw new UnauthorizedException();
    }

    return this.getWebinarsUsecase.execute(user.accountId);
  }

  @Post('webinars')
  async addWebinar(
    @Req() request: any,
    @Body() body: { 
      title: string; 
      scheduledAt: string; 
      teamsLink: string; 
      registrationLink?: string;
    }
  ) {
    const user = request.user;
    
    if (!user?.accountId || !user?.isDashboard) {
      throw new UnauthorizedException();
    }

    return this.addWebinarUsecase.execute(
      user.accountId,
      body.title,
      new Date(body.scheduledAt),
      body.teamsLink,
      body.registrationLink
    );
  }

  @Delete('webinars/:id')
  async deleteWebinar(
    @Req() request: any,
    @Param('id') webinarId: string
  ) {
    const user = request.user;
    
    if (!user?.accountId || !user?.isDashboard) {
      throw new UnauthorizedException();
    }

    await this.deleteWebinarUsecase.execute(user.accountId, webinarId);
    return { success: true };
  }

  @Put('webinars/:id')
  async updateWebinar(
    @Req() request: any,
    @Param('id') webinarId: string,
    @Body() body: {
      title?: string;
      scheduledAt?: string;
      teamsLink?: string;
      registrationLink?: string | null;
      isActive?: boolean;
    }
  ) {
    const user = request.user;
    
    if (!user?.accountId || !user?.isDashboard) {
      throw new UnauthorizedException();
    }

    return this.updateWebinarUsecase.execute(user.accountId, webinarId, {
      ...body,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
    });
  }

  @Get('account-details')
  async getAccountDetails(@Req() request: any) {
    const user = request.user;
    
    if (!user?.accountId || !user?.isDashboard) {
      throw new UnauthorizedException();
    }

    return this.getAccountDetailsUsecase.execute(user.accountId);
  }

  @Post('webinars/:id/send-reminder')
  async sendWebinarReminder(
    @Req() request: any,
    @Param('id') webinarId: string
  ) {
    const user = request.user;
    
    if (!user?.accountId || !user?.isDashboard) {
      throw new UnauthorizedException();
    }

    return this.sendWebinarReminderUsecase.execute(user.accountId, webinarId);
  }
}

