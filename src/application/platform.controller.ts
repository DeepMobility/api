import { Request, Body, Controller, Get, Post, Param } from '@nestjs/common';
import { Public } from './auth.decorator';
import { LoginUsecase } from '../domain/platform/login.usecase';
import { RegisterUsecase } from '../domain/platform/register.usecase';
import { UpdateMyJobTypeUsecase } from '../domain/platform/updateMyJobType.usecase';
import { UpdateMyPainfulBodyParts } from 'src/domain/platform/updateMyPainfulBodyParts.usecase';
import { UpdateMyOtherThematicInterests } from 'src/domain/platform/updateMyOtherThematicInterests.usecase';
import { GetMyDashboardUsecase } from 'src/domain/platform/getMyDashboard.usecase';
import { StartSessionUsecase } from 'src/domain/platform/startSession.usecase';
import { EndSessionUsecase } from 'src/domain/platform/endSession.usecase';
import { GetAccountLogoUrlUsecase } from 'src/domain/platform/getAccountLogoUrl.usecase';
import { ResetPasswordUsecase } from 'src/domain/platform/resetPassword.usecase';
import { NewPasswordUsecase } from 'src/domain/platform/newPassword.usecase';
import { AnswerSurveyUsecase } from 'src/domain/platform/answerSurvey.usecase';
import { UpdateMyReminderTimeUsecase } from 'src/domain/platform/updateMyReminderTime.usecase';
import { GetMyReminderTimeUsecase } from 'src/domain/platform/getMyReminderTime.usecase';

@Controller('platform')
export class PlatformController {
  constructor(
    private loginUsecase: LoginUsecase,
    private registerUsecase: RegisterUsecase,
    private resetPasswordUsecase: ResetPasswordUsecase,
    private newPasswordUsecase: NewPasswordUsecase,
    private updateMyJobTypeUsecase: UpdateMyJobTypeUsecase,
    private updateMyPainfulBodyPartsUsecase: UpdateMyPainfulBodyParts,
    private updateMyOtherThematicInterestsUsecase: UpdateMyOtherThematicInterests,
    private getMyDashboardUsecase: GetMyDashboardUsecase,
    private startSessionUsecase: StartSessionUsecase,
    private endSessionUsecase: EndSessionUsecase,
    private getAccountLogoUrlUsecase: GetAccountLogoUrlUsecase,
    private answerSurveyUsecase: AnswerSurveyUsecase,
    private updateMyReminderTimeUsecase: UpdateMyReminderTimeUsecase,
    private getMyReminderTimeUsecase: GetMyReminderTimeUsecase,
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

  @Public()
  @Post('reset-password')
  resetPassword(@Body() body: Record<string, any>) {
    return this.resetPasswordUsecase.reset(body.accountHost, body.email);
  }

  @Public()
  @Post('new-password')
  newPassword(@Body() body: Record<string, any>) {
    return this.newPasswordUsecase.update(body.token, body.newPassword);
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

  @Post('update-my-painful-body-parts')
  updateMyPainfulBodyParts(
    @Body() body: Record<string, any>,
    @Request() request: any
  ): Promise<any> {
    return this.updateMyPainfulBodyPartsUsecase.update(
      request.user.id,
      body.bodyParts,
    );
  }

  @Post('update-my-other-thematic-interests')
  updateMyOtherThematicInterests(
    @Body() body: Record<string, any>,
    @Request() request: any
  ): Promise<any> {
    return this.updateMyOtherThematicInterestsUsecase.update(
      request.user.id,
      body.thematics,
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
  
  @Post('answer-survey')
  answerSurvey(
    @Body() body: Record<string, any>,
    @Request() request: any
  ): Promise<any> {
    return this.answerSurveyUsecase.answer(
      request.user.id,
      body.survey
    );
  }

  @Post('update-my-reminder-time')
  updateMyReminderTime(
    @Body() body: Record<string, any>,
    @Request() request: any
  ): Promise<any> {
    return this.updateMyReminderTimeUsecase.update(
      request.user.id,
      body.reminderTime
    );
  }

  @Get('get-my-reminder-time')
  getMyReminderTime(@Request() request: any): Promise<any> {
    return this.getMyReminderTimeUsecase.get(request.user.id);
  }
}