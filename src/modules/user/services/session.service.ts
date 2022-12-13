import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { SessionThrough, User, UserSession } from '../entities';
import * as crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSession)
    private sessionRepository: Repository<UserSession>,
    private configService: ConfigService,
  ) {}

  create(user: User, through: SessionThrough = SessionThrough.EMAIL) {
    const token = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = UserSession.create({
      user_id: user.id,
      token,
      through,
    });

    return this.sessionRepository.save(session);
  }

  getFromToken(token: string) {
    return this.sessionRepository.findOne({
      where: {
        created_at: Raw(
          (alias) =>
            `${alias} > NOW() - INTERVAL '${this.configService.get(
              'auth.session_expires',
            )}' DAY`,
        ),
        token,
      },
    });
  }

  async logout(token: string) {
    return this.sessionRepository.update(
      { token },
      {
        logged_out_at: new Date(),
      },
    );
  }
}
