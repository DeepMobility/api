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

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "ssl0.ovh.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.OVH_EMAIL,
        pass: process.env.OVH_PASSWORD,
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
      from: `"DeepMobility" <${process.env.OVH_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: textContent,
      html: htmlContent,
    });
  }
}

