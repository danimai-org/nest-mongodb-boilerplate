import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaModule } from '../media/media.module';
import { UserController } from './controllers';
import { UserService, TokenService, SessionService } from './services';
import User, { UserSchema } from '../../models/user.model';
import Session, { SessionSchema } from '../../models/session.model';
import Token, { TokenSchema } from '../../models/token.model';
import * as bcrypt from 'bcryptjs';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function (next) {
            if (!this.isModified('password')) next();
            this.password = bcrypt.hashSync(this.password);
            next();
          });
          return schema;
        },
      },
      {
        name: Session.name,
        useFactory: () => SessionSchema,
      },
      {
        name: Token.name,
        useFactory: () => {
          const schema = TokenSchema;

          schema.pre('save', function () {
            this.token = `${randomStringGenerator()}-${randomStringGenerator()}`;
          });
          return schema;
        },
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
