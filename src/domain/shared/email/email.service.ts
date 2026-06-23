import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailTemplates } from './templates';
import { emailTranslations } from './translations/fr';

export interface EmailOptions {
  to: string;
  subject: string;
  template: keyof typeof emailTemplates;
  variables: Record<string, string>;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor() {
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'postmaster@deepmobility.com';

    this.from = `"DeepMobility" <${fromEmail}>`;
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.lettermint.co',
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER || 'lettermint',
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const template = emailTemplates[options.template];
    const translations = emailTranslations[options.template];

    if (!template || !translations) {
      throw new Error(`Template or translations not found for: ${options.template}`);
    }

    // Remplacer les variables dans le template
    let htmlContent = template.html;
    let textContent = template.text;

    Object.entries(options.variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), value);
      textContent = textContent.replace(new RegExp(placeholder, 'g'), value);
    });

    // Remplacer les traductions
    Object.entries(translations).forEach(([key, value]) => {
      const placeholder = `{{t.${key}}}`;
      htmlContent = htmlContent.replace(new RegExp(placeholder.replace(/\./g, '\\.'), 'g'), value);
      textContent = textContent.replace(new RegExp(placeholder.replace(/\./g, '\\.'), 'g'), value);
    });

    await this.transporter.sendMail({
      from: this.from,
      to: options.to,
      subject: options.subject,
      text: textContent,
      html: htmlContent,
    });
  }
}
