import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaModule } from '../media/media.module';
import { UserController } from './controllers';
import { UserService, TokenService, SessionService } from './services';
import User, { UserSchema } from './models/user.model';
import Session, { SessionSchema } from './models/session.model';
import Token, { TokenSchema } from './models/token.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: Session.name,
        schema: SessionSchema,
      },
      {
        name: Token.name,
        schema: TokenSchema,
      },
    ]),
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
  providers: [UserService, TokenService, SessionService],
  controllers: [UserController],
  exports: [UserService, TokenService, SessionService],
})
export class UserModule {}
