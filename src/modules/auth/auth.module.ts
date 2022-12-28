import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import User, { UserSchema } from '../user/models/user.model';
import { UserModule } from '../user/user.module';
import {
  CommonController,
  EmailController,
  GoogleAuthenticationController,
} from './controllers';
import { CommonService, GoogleAuthenticationService } from './services';
import { EmailService } from './services/email.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MailModule, UserModule],
  providers: [EmailService, CommonService, GoogleAuthenticationService],
  controllers: [
    EmailController,
    CommonController,
    GoogleAuthenticationController,
  ],
  exports: [],
})
export class AuthModule {}
