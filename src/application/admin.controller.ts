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
import { GetAccountUsersUsecase } from '../domain/admin/getAccountUsers.usecase';
import { GetUserDetailsUsecase } from '../domain/admin/getUserDetails.usecase';
import { AddUserUsecase } from '../domain/admin/addUser.usecase';
import { EditUserUsecase } from '../domain/admin/editUser.usecase';
import { RemoveUserUsecase } from '../domain/admin/removeUser.usecase';
import { GetAccountTeamsUsecase } from '../domain/admin/getAccountTeams.usecase';
import { GetTeamDetailsUsecase } from '../domain/admin/getTeamDetails.usecase';
import { AddTeamUsecase } from '../domain/admin/addTeam.usecase';
import { EditTeamUsecase } from '../domain/admin/editTeam.usecase';
import { RemoveTeamUsecase } from '../domain/admin/removeTeam.usecase';

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
    private getAccountChallengesUsecase: GetAccountChallengesUsecase,
    private addChallengeUsecase: AddChallengeUsecase,
    private editChallengeUsecase: EditChallengeUsecase,
    private removeChallengeUsecase: RemoveChallengeUsecase,
    private getChallengeDetailsUsecase: GetChallengeDetailsUsecase,
    private getAccountUsersUsecase: GetAccountUsersUsecase,
    private getUserDetailsUsecase: GetUserDetailsUsecase,
    private addUserUsecase: AddUserUsecase,
    private editUserUsecase: EditUserUsecase,
    private removeUserUsecase: RemoveUserUsecase,
    private getAccountTeamsUsecase: GetAccountTeamsUsecase,
    private getTeamDetailsUsecase: GetTeamDetailsUsecase,
    private addTeamUsecase: AddTeamUsecase,
    private editTeamUsecase: EditTeamUsecase,
    private removeTeamUsecase: RemoveTeamUsecase
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

  @Admin()
  @Get('get-account-users/:accountId')
  getAccountUsers(@Param('accountId') accountId: string): Promise<any[]> {
    return this.getAccountUsersUsecase.get(accountId);
  }

  @Admin()
  @Get('get-user-details/:userId')
  getUserDetails(@Param('userId') userId: string): Promise<any> {
    return this.getUserDetailsUsecase.get(userId);
  }

  @Admin()
  @Post('add-user')
  addUser(@Body() body: Record<string, any>): Promise<any> {
    return this.addUserUsecase.add(
      body.accountId,
      body.email,
      body.password,
      body.firstName,
      body.lastName,
      body.gender,
      body.birthYear
    );
  }

  @Admin()
  @Post('edit-user')
  editUser(@Body() body: Record<string, any>): Promise<any> {
    return this.editUserUsecase.edit(
      body.userId,
      body.email,
      body.firstName,
      body.lastName,
      body.password,
      body.gender,
      body.birthYear
    );
  }

  @Admin()
  @Post('remove-user')
  removeUser(@Body() body: Record<string, any>): Promise<void> {
    return this.removeUserUsecase.remove(body.userId);
  }

  @Admin()
  @Get('get-account-teams/:accountId')
  getAccountTeams(@Param('accountId') accountId: string): Promise<any[]> {
    return this.getAccountTeamsUsecase.get(accountId);
  }

  @Admin()
  @Get('get-team-details/:teamId')
  getTeamDetails(@Param('teamId') teamId: string): Promise<any> {
    return this.getTeamDetailsUsecase.get(teamId);
  }

  @Admin()
  @Post('add-team')
  addTeam(@Body() body: Record<string, any>): Promise<any> {
    return this.addTeamUsecase.add(
      body.accountId,
      body.name,
      body.description
    );
  }

  @Admin()
  @Post('edit-team')
  editTeam(@Body() body: Record<string, any>): Promise<any> {
    return this.editTeamUsecase.edit(
      body.teamId,
      body.name,
      body.description
    );
  }

  @Admin()
  @Post('remove-team')
  removeTeam(@Body() body: Record<string, any>): Promise<void> {
    return this.removeTeamUsecase.remove(body.teamId);
  }
}
