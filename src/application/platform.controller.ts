import { Request, Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from './auth.decorator';
import { LoginUsecase } from '../domain/platform/login.usecase';
import { RegisterUsecase } from '../domain/platform/register.usecase';
import { UpdateUserJobTypeUsecase } from '../domain/platform/updateUserJobType.usecase';

@Controller('platform')
export class PlatformController {
  constructor(
    private loginUsecase: LoginUsecase,
    private registerUsecase: RegisterUsecase,
    private updateUserJobTypeUsecase: UpdateUserJobTypeUsecase,
  ) {}

  @Public()
  @Post('login')
  login(@Body() body: Record<string, any>): Promise<any> {
    return this.loginUsecase.login(body.accountHost, body.email, body.password);
  }

  @Public()
  @Post('register')
  addAccount(@Body() body: Record<string, any>): Promise<any>  {
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

  @Post('update-user-job-type')
  updateUserJobType(
    @Body() body: Record<string, any>,
    @Request() request: any
  ): Promise<any>  {
    return this.updateUserJobTypeUsecase.update(
      request.user.id,
      body.jobType,
    );
  }
}
