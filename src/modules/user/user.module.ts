import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaModule } from '../media/media.module';
import { MulterConfigService } from '../media/multer_config.service';
import { UserController } from './controllers';
import { Token, User, UserSession } from './entities';
import { UserService, TokenService, UserSessionService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSession, Token]),
    MediaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('auth.secret'),
        signOptions: { expiresIn: configService.get('auth.expires') },
      }),
    }),
  ],
  providers: [UserService, TokenService, UserSessionService],
  controllers: [UserController],
  exports: [UserService, TokenService, UserSessionService],
})
export class UserModule {}
