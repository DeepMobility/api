import { Request, Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from './auth.decorator';
import { LoginUsecase } from '../domain/platform/login.usecase';
import { RegisterUsecase } from '../domain/platform/register.usecase';
import { UpdateMyJobTypeUsecase } from '../domain/platform/updateMyJobType.usecase';
import { GetMyDashboardUsecase } from 'src/domain/platform/getMyDashboard.usecase';

@Controller('platform')
export class PlatformController {
  constructor(
    private loginUsecase: LoginUsecase,
    private registerUsecase: RegisterUsecase,
    private updateMyJobTypeUsecase: UpdateMyJobTypeUsecase,
    private getMyDashboardUsecase: GetMyDashboardUsecase,
  ) {}

  @Public()
  @Post('login')
  login(@Body() body: Record<string, any>): Promise<any> {
    return this.loginUsecase.login(body.accountHost, body.email, body.password);
  }

  @Public()
  @Post('register')
  addAccount(@Body() body: Record<string, any>): Promise<any> {
    return this.registerUsecase.register(
      body.accountHost,
      body.email,
      body.password,
      body.firstName,
      body.lastName,
      body.gender,
      body.birthYear,
    );
  }

  @Post('update-my-job-type')
  updateMyJobType(
    @Body() body: Record<string, any>,
    @Request() request: any
  ): Promise<any> {
    return this.updateMyJobTypeUsecase.update(
      request.user.id,
      body.jobType,
    );
  }

  @Get('get-my-dashboard')
  getMyDashboard(@Request() request: any): Promise<any> {
    return this.getMyDashboardUsecase.get(request.user.id);
  }
}
