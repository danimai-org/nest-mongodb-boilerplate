import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { MailerConfigClass } from '../mail/services/mailer_config.service';
import { MediaModule } from '../media/media.module';
import { UserModule } from '../user/user.module';
import Configs from './config.util';
import User from '../user/models/user.model';

const modules = [MailModule, AuthModule, MediaModule, UserModule];
export const global_modules = [
  MongooseModule.forRootAsync({
    useFactory(configService: ConfigService) {
      console.log(User.name);
      return { uri: configService.get('database.uri') };
    },
    inject: [ConfigService],
  }),
  ConfigModule.forRoot({
    load: [...Configs],
    isGlobal: true,
    envFilePath: ['.env'],
  }),
  MailerModule.forRootAsync({
    useClass: MailerConfigClass,
  }),
  PassportModule,
];

export const providers = [JwtStrategy];

@Module({
  imports: [...global_modules, ...modules],
  providers,
})
export class AppModule {}
