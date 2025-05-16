import { Body, Controller, Get, Param, Post, Put, Request } from '@nestjs/common';
import { Public, Admin } from './auth.decorator';
import { LoginUsecase } from '../domain/admin/login.usecase';
import { GetAllAccountsUsecase } from '../domain/admin/getAllAccounts.usecase';
import { AddAccountUsecase } from '../domain/admin/addAccount.usecase';
import { GetAllVideosUsecase } from 'src/domain/admin/getAllVideos.usecase';
import { AddVideoUsecase } from 'src/domain/admin/addVideo.usecase';
import { RemoveVideoUsecase } from 'src/domain/admin/removeVideo.usecase';
import { RemoveAccountUsecase } from 'src/domain/admin/removeAccount.usecase';
import { GetAccountDetailsUsecase } from 'src/domain/admin/getAccountDetails.usecase';
import { EditVideoUsecase } from 'src/domain/admin/editVideo.usecase';
import { GetVideoDetailsUsecase } from 'src/domain/admin/getVideoDetails.usecase';
import { GetAccountChallengesUsecase } from '../domain/admin/getAccountChallenges.usecase';
import { AddChallengeUsecase } from '../domain/admin/addChallenge.usecase';
import { EditChallengeUsecase } from '../domain/admin/editChallenge.usecase';
import { RemoveChallengeUsecase } from '../domain/admin/removeChallenge.usecase';
import { GetChallengeDetailsUsecase } from '../domain/admin/getChallengeDetails.usecase';

@Controller('admin')
export class AdminController {
  constructor(
    private loginUsecase: LoginUsecase,
    private getAllAccountsUsecase: GetAllAccountsUsecase,
    private addAccountUsecase: AddAccountUsecase,
    private removeAccountUsecase: RemoveAccountUsecase,
    private getAllVideosUsecase: GetAllVideosUsecase,
    private addVideoUsecase: AddVideoUsecase,
    private getVideoDetailsUsecase: GetVideoDetailsUsecase,
    private editVideoUsecase: EditVideoUsecase,
    private removeVideoUsecase: RemoveVideoUsecase,
    private getAccountDetailsUsecase: GetAccountDetailsUsecase,
    private readonly getAccountChallengesUsecase: GetAccountChallengesUsecase,
    private readonly addChallengeUsecase: AddChallengeUsecase,
    private readonly editChallengeUsecase: EditChallengeUsecase,
    private readonly removeChallengeUsecase: RemoveChallengeUsecase,
    private readonly getChallengeDetailsUsecase: GetChallengeDetailsUsecase,
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
  @Get('get-video-details/:videoId')
  getVideoDetails(@Param() params: any): Promise<any> {
    return this.getVideoDetailsUsecase.get(params.videoId);
  }

  @Admin()
  @Post('edit-video')
  editVideo(@Body() body: Record<string, any>): Promise<any> {
    return this.editVideoUsecase.edit(
      body.videoId,
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

  @Admin()
  @Get('get-account-details/:accountId')
  getAccountDetails(@Param() params: any): Promise<any> {
    return this.getAccountDetailsUsecase.get(params.accountId);
  }

  @Get('get-account-challenges/:accountId')
  getAccountChallenges(
    @Request() request: any,
    @Param('accountId') accountId: string
  ): Promise<any> {
    return this.getAccountChallengesUsecase.getAccountChallenges(accountId);
  }

  @Get('get-challenge-details/:challengeId')
  getChallengeDetails(
    @Param('challengeId') challengeId: string
  ): Promise<any> {
    return this.getChallengeDetailsUsecase.get(challengeId);
  }

  @Post('add-challenge')
  addChallenge(
    @Body() body: {
      accountId: string;
      title: string;
      description: string;
      type: string;
      status: string;
      associationName: string;
      associationLogoUrl: string;
      startDate: Date;
      endDate: Date;
      goalAmount: number;
      conversionRate: number;
    },
    @Request() request: any
  ): Promise<any> {
    return this.addChallengeUsecase.add(
      body.accountId,
      body.title,
      body.description,
      body.type,
      body.status,
      body.associationName,
      body.associationLogoUrl,
      body.startDate,
      body.endDate,
      body.goalAmount,
      body.conversionRate
    );
  }

  @Post('edit-challenge')
  editChallenge(
    @Body() body: {
      challengeId: string;
      title: string;
      description: string;
      associationName: string;
      associationLogoUrl: string;
      goalAmount: number;
      conversionRate: number;
      status: string;
      type: string;
      startDate: Date;
      endDate: Date;
    }
  ): Promise<any> {
    return this.editChallengeUsecase.edit(
      body.challengeId,
      body.title,
      body.description,
      body.associationName,
      body.associationLogoUrl,
      body.goalAmount,
      body.conversionRate,
      body.status,
      body.type,
      body.startDate,
      body.endDate
    );
  }

  @Post('remove-challenge')
  removeChallenge(
    @Body() body: {
      challengeId: string
    }
  ): Promise<void> {
    return this.removeChallengeUsecase.remove(body.challengeId);
  }
}
