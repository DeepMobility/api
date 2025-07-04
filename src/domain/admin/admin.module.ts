import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../database/entities/account.entity';
import { User } from '../../database/entities/user.entity';
import { Video } from '../../database/entities/video.entity';
import { Team } from '../../database/entities/team.entity';
import { Challenge } from '../../database/entities/challenge.entity';
import { LoginUsecase } from './login.usecase';
import { GetAllAccountsUsecase } from './getAllAccounts.usecase';
import { AddAccountUsecase } from './addAccount.usecase';
import { GetAllVideosUsecase } from './getAllVideos.usecase';
import { AddVideoUsecase } from './addVideo.usecase';
import { RemoveVideoUsecase } from './removeVideo.usecase';
import { RemoveAccountUsecase } from './removeAccount.usecase';
import { GetAccountDetailsUsecase } from './getAccountDetails.usecase';
import { EditVideoUsecase } from './editVideo.usecase';
import { GetVideoDetailsUsecase } from './getVideoDetails.usecase';
import { GetAccountChallengesUsecase } from './getAccountChallenges.usecase';
import { AddChallengeUsecase } from './addChallenge.usecase';
import { EditChallengeUsecase } from './editChallenge.usecase';
import { RemoveChallengeUsecase } from './removeChallenge.usecase';
import { GetChallengeDetailsUsecase } from './getChallengeDetails.usecase';
import { GetAccountUsersUsecase } from './getAccountUsers.usecase';
import { GetUserDetailsUsecase } from './getUserDetails.usecase';
import { AddUserUsecase } from './addUser.usecase';
import { EditUserUsecase } from './editUser.usecase';
import { RemoveUserUsecase } from './removeUser.usecase';
import { GetAccountTeamsUsecase } from './getAccountTeams.usecase';
import { GetTeamDetailsUsecase } from './getTeamDetails.usecase';
import { AddTeamUsecase } from './addTeam.usecase';
import { EditTeamUsecase } from './editTeam.usecase';
import { RemoveTeamUsecase } from './removeTeam.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User, Video, Challenge, Team])],
  providers: [
    LoginUsecase,
    AddAccountUsecase,
    RemoveAccountUsecase,
    GetAllAccountsUsecase,
    GetAllVideosUsecase,
    AddVideoUsecase,
    GetVideoDetailsUsecase,
    EditVideoUsecase,
    RemoveVideoUsecase,
    GetAccountDetailsUsecase,
    GetAccountChallengesUsecase,
    AddChallengeUsecase,
    EditChallengeUsecase,
    RemoveChallengeUsecase,
    GetChallengeDetailsUsecase,
    GetAccountUsersUsecase,
    GetUserDetailsUsecase,
    AddUserUsecase,
    EditUserUsecase,
    RemoveUserUsecase,
    GetAccountTeamsUsecase,
    GetTeamDetailsUsecase,
    AddTeamUsecase,
    EditTeamUsecase,
    RemoveTeamUsecase
  ],
  exports: [
    LoginUsecase,
    AddAccountUsecase,
    RemoveAccountUsecase,
    GetAllAccountsUsecase,
    GetAllVideosUsecase,
    AddVideoUsecase,
    GetVideoDetailsUsecase,
    EditVideoUsecase,
    RemoveVideoUsecase,
    GetAccountDetailsUsecase,
    GetAccountChallengesUsecase,
    AddChallengeUsecase,
    EditChallengeUsecase,
    RemoveChallengeUsecase,
    GetChallengeDetailsUsecase,
    GetAccountUsersUsecase,
    GetUserDetailsUsecase,
    AddUserUsecase,
    EditUserUsecase,
    RemoveUserUsecase,
    GetAccountTeamsUsecase,
    GetTeamDetailsUsecase,
    AddTeamUsecase,
    EditTeamUsecase,
    RemoveTeamUsecase
  ]
})
export class AdminModule {}
