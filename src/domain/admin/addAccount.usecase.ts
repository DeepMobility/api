import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../database/entities/account.entity';
import nodeFetch from 'node-fetch'

@Injectable()
export class AddAccountUsecase {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async add(name: string, slug: string, host: string, logoUrl: string): Promise<any> {    
    let requestOptions: RequestInit = {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    };

    const authResponse = await nodeFetch(`https://:${process.env.SCALINGO_API_TOKEN}@auth.scalingo.com/v1/tokens/exchange`, requestOptions);

    const authBody = await authResponse.json();
    const token = authBody.token;

    requestOptions.headers["Authorization"] = `Bearer ${token}`;

    requestOptions.body = JSON.stringify({
      domain: { name: host }
    });

    await fetch(`https://api.osc-fr1.scalingo.com/v1/apps/${process.env.SCALINGO_APP_NAME}/domains`, requestOptions);

    requestOptions.body = JSON.stringify({ scope: null });

    await Promise.all([
      fetch(`https://api.osc-fr1.scalingo.com/v1/apps/${process.env.SCALINGO_API_NAME}/restart`, requestOptions),
      fetch(`https://api.osc-fr1.scalingo.com/v1/apps/${process.env.SCALINGO_APP_NAME}/restart`, requestOptions)
    ]);

    return this.accountsRepository.save({ name, slug, host, logoUrl });
  }
}
