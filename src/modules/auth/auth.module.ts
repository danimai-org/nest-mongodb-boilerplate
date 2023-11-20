import { Global, Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import {
  CommonController,
  EmailController,
  GoogleAuthenticationController,
} from './controllers';
import { CommonService, GoogleAuthenticationService } from './services';
import { EmailService } from './services/email.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
  imports: [MailModule, UserModule],
  providers: [
    EmailService,
    CommonService,
    GoogleAuthenticationService,
    { provide: APP_GUARD, useClass: RolesGuard },
    JwtStrategy,
  ],
  controllers: [
    EmailController,
    CommonController,
    GoogleAuthenticationController,
  ],
  exports: [],
})
export class AuthModule {}
