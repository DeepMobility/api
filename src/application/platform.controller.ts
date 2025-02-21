import { Request, Body, Controller, Get, Post, Param } from '@nestjs/common';
import { Public } from './auth.decorator';
import { LoginUsecase } from '../domain/platform/login.usecase';
import { RegisterUsecase } from '../domain/platform/register.usecase';
import { UpdateMyJobTypeUsecase } from '../domain/platform/updateMyJobType.usecase';
import { UpdateMyPainfulBodyPart } from 'src/domain/platform/updateMyPainfulBodyPart.usecase';
import { UpdateMyOtherThematicInterest } from 'src/domain/platform/updateMyOtherThematicInterest.usecase';
import { GetMyDashboardUsecase } from 'src/domain/platform/getMyDashboard.usecase';
import { StartSessionUsecase } from 'src/domain/platform/startSession.usecase';
import { EndSessionUsecase } from 'src/domain/platform/endSession.usecase';
import { GetAccountLogoUrlUsecase } from 'src/domain/platform/getAccountLogoUrl.usecase';

@Controller('platform')
export class PlatformController {
  constructor(
    private loginUsecase: LoginUsecase,
    private registerUsecase: RegisterUsecase,
    private updateMyJobTypeUsecase: UpdateMyJobTypeUsecase,
    private updateMyPainfulBodyPartUsecase: UpdateMyPainfulBodyPart,
    private updateMyOtherThematicInterestUsecase: UpdateMyOtherThematicInterest,
    private getMyDashboardUsecase: GetMyDashboardUsecase,
    private startSessionUsecase: StartSessionUsecase,
    private endSessionUsecase: EndSessionUsecase,
    private getAccountLogoUrlUsecase: GetAccountLogoUrlUsecase,
  ) {}

  @Public()
  @Get('get-account-logo-url/:accountHost')
  getAccountLogoUrl(@Param() params: any): Promise<any> {
    return this.getAccountLogoUrlUsecase.get(params.accountHost);
  }

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

  @Post('update-my-painful-body-part')
  updateMyPainfulBodyPart(
    @Body() body: Record<string, any>,
    @Request() request: any
  ): Promise<any> {
    return this.updateMyPainfulBodyPartUsecase.update(
      request.user.id,
      body.bodyPart,
    );
  }

  @Post('update-my-other-thematic-interest')
  updateMyOtherThematicInterest(
    @Body() body: Record<string, any>,
    @Request() request: any
  ): Promise<any> {
    return this.updateMyOtherThematicInterestUsecase.update(
      request.user.id,
      body.thematic,
    );
  }

  @Get('get-my-dashboard')
  getMyDashboard(@Request() request: any): Promise<any> {
    return this.getMyDashboardUsecase.get(request.user.id);
  }

  @Post('start-session')
  startSession(
    @Body() body: Record<string, any>,
    @Request() request: any
  ): Promise<any> {
    return this.startSessionUsecase.start(
      request.user.id,
      body.videoId,
      body.question,
      body.questionRating
    );
  }

  @Post('end-session')
  endSession(
    @Body() body: Record<string, any>,
  ): Promise<any> {
    return this.endSessionUsecase.end(
      body.sessionId,
      body.questionRating
    );
  }
}
