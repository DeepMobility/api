import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public, Admin } from './auth.decorator';
import { LoginUsecase } from '../domain/admin/login.usecase';
import { GetAllAccountsUsecase } from '../domain/admin/getAllAccounts.usecase';
import { AddAccountUsecase } from '../domain/admin/addAccount.usecase';
import { GetAllVideosUsecase } from 'src/domain/admin/getAllVideos.usecase';
import { AddVideoUsecase } from 'src/domain/admin/addVideo.usecase';
import { RemoveVideoUsecase } from 'src/domain/admin/removeVideo.usecase';
import { RemoveAccountUsecase } from 'src/domain/admin/removeAccount.usecase';

@Controller('admin')
export class AdminController {
  constructor(
    private loginUsecase: LoginUsecase,
    private getAllAccountsUsecase: GetAllAccountsUsecase,
    private addAccountUsecase: AddAccountUsecase,
    private removeAccountUsecase: RemoveAccountUsecase,
    private getAllVideosUsecase: GetAllVideosUsecase,
    private addVideoUsecase: AddVideoUsecase,
    private removeVideoUsecase: RemoveVideoUsecase
  ) {}

  @Public()
  @Post('login')
  login(@Body() body: Record<string, any>): Promise<any> {
    return this.loginUsecase.login(body.email, body.password);
  }

  @Admin()
  @Get('get-all-accounts')
  getAllAccounts(): Promise<any[]> {
    return this.getAllAccountsUsecase.getAll();
  }

  @Admin()
  @Post('add-account')
  addAccount(@Body() body: Record<string, any>): Promise<any> {
    return this.addAccountUsecase.add(
      body.name,
      body.slug,
      body.host,
      body.logoUrl,
    );
  }

  @Admin()
  @Post('remove-account')
  removeAccount(@Body() body: Record<string, any>): Promise<any> {
    return this.removeAccountUsecase.remove(body.accountId)
  }

  @Admin()
  @Get('get-all-videos')
  getAllVideos(): Promise<any[]> {
    return this.getAllVideosUsecase.getAll();
  }

  @Admin()
  @Post('add-video')
  addVideo(@Body() body: Record<string, any>): Promise<any> {
    return this.addVideoUsecase.add(
      body.name,
      body.url,
      body.thumbnailUrl,
      body.description,
      body.duration,
      body.course,
      body.coursePosition,
      body.bodyParts,
      body.exerciseTypes,
    );
  }

  @Admin()
  @Post('remove-video')
  removeVideo(@Body() body: Record<string, any>): Promise<any> {
    return this.removeVideoUsecase.remove(body.videoId)
  }
}
