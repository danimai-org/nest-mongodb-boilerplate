import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailData } from '../mail.interface';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async user_registation(
    mailData: MailData<{
      hash: string;
    }>,
  ) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Thank You For Registration, Verify Your Account.',
      text: `${this.configService.get(
        'app.frontendDomain',
      )}/auth/verify?token=${mailData.data.hash}`,
      template: 'auth/registration',
      context: {
        url: `${this.configService.get(
          'app.frontendDomain',
        )}/auth/verify?token=${mailData.data.hash}`,
        app_name: this.configService.get('app.name'),
        title: 'Thank You For Registration, Verify Your Account.',
        actionTitle: 'Verify Your Account',
      },
    });
  }

  async forgot_password(
    mailData: MailData<{
      hash: string;
    }>,
  ) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Here is your Link for Reset Password.',
      text: `${this.configService.get(
        'app.frontendDomain',
      )}/auth/reset-password?token=${mailData.data.hash}`,
      template: 'auth/registration',
      context: {
        url: `${this.configService.get(
          'app.frontendDomain',
        )}/auth/reset-password?token=${mailData.data.hash}`,
        app_name: this.configService.get('app.name'),
        title: 'Here is your Link for Reset Password.',
        actionTitle: 'Reset Password',
      },
    });
  }
}
