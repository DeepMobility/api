import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public, Admin } from './auth.decorator';
import { LoginUsecase } from '../domain/admin/login.usecase';
import { GetAllAccountsUsecase } from '../domain/admin/getAllAccounts.usecase';
import { AddAccountUsecase } from '../domain/admin/addAccount.usecase';

@Controller('admin')
export class AdminController {
  constructor(
    private loginUsecase: LoginUsecase,
    private getAllAccountsUsecase: GetAllAccountsUsecase,
    private addAccountUsecase: AddAccountUsecase
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
  addAccount(@Body() body: Record<string, any>): Promise<any>  {
    return this.addAccountUsecase.add(
      body.name,
      body.slug,
      body.host
    );
  }
}
