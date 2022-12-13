import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret'),
    });
  }

  public validate(payload: JwtPayload) {
    if (!payload.email_verified_at) {
      throw new UnauthorizedException({
        message: 'Please verify your email.',
      });
    }

    if (!payload.is_active) {
      throw new ForbiddenException({
        message: 'Your account is not active.',
      });
    }
    return payload;
  }
}
