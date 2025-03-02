import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ResetPasswordUsecase {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async reset(accountHost: string, email: string): Promise<any> {
    if (!accountHost) {
      throw new BadRequestException()
    }

    const user = await this.usersRepository.findOne({
      relations: { account: true },
      where: {
        email,
        account: { host: accountHost }
      },
    })

    if (user) {
      let validUntil = new Date()
      validUntil.setHours(validUntil.getHours() + 1)

      const token = await this.jwtService.signAsync({ userId: user.id, validUntil }, { secret: process.env.JWT_SECRET });

      const http = accountHost.startsWith("localhost") ? "http://" : "https://";

      const transporter = nodemailer.createTransport({
        host: "ssl0.ovh.net",
        port: 465,
        secure: true,
        auth: {
          user: process.env.OVH_EMAIL,
          pass: process.env.OVH_PASSWORD,
        },
      });

      transporter.sendMail({
        from: `"DeepMobility" <${process.env.OVH_EMAIL}>`,
        to: email,
        subject: "Réinitialisation de mot de passe",
        text: `
          Bonjour,\n\n
          Voici le lien pour réinitialiser votre mot de passe :\n\n
          ${http}${accountHost}/auth/nouveau-mot-de-passe?token=${token} \n\n
          L'équipe DeepMobility
        `,
        html: `
          <span>Bonjour,</span><br /><br />
          <span>Voici le lien pour réinitialiser votre mot de passe :</span><br /><br />
          <a href="${http}${accountHost}/auth/nouveau-mot-de-passe?token=${token}">réinitialiser mon mot de passe</a><br /><br />
          <span>L'Equipe DeepMobility</span>
        `,
      });
    }

    return {};
  }
}
