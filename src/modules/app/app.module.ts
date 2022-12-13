import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { TypeOrmConfigService } from '../database/typeorm-config.service';
import { MailModule } from '../mail/mail.module';
import { MailerConfigClass } from '../mail/services/mailer_config.service';
import { MediaModule } from '../media/media.module';
import { UserModule } from '../user/user.module';
import Configs from './config.util';

const modules = [MailModule, AuthModule, MediaModule, UserModule];
export const global_modules = [
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
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ...global_modules,
    ...modules,
  ],
  providers,
})
export class AppModule {}
