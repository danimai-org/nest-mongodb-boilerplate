import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { User } from '../user/entities';
import { UserModule } from '../user/user.module';
import {
  CommonController,
  EmailController,
  GoogleAuthenticationController,
} from './controllers';
import { CommonService, GoogleAuthenticationService } from './services';
import { EmailService } from './services/email.service';

@Module({
  imports: [MailModule, UserModule, TypeOrmModule.forFeature([User])],
  providers: [EmailService, CommonService, GoogleAuthenticationService],
  controllers: [
    EmailController,
    CommonController,
    GoogleAuthenticationController,
  ],
  exports: [],
})
export class AuthModule {}
