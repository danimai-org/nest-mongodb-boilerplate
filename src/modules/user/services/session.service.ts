import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import Session, {
  SessionDocument,
  SessionThrough,
} from '../../../models/session.model';
import { UserDocument } from '../../../models/user.model';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name)
    private sessionModel: Model<SessionDocument>,
    private configService: ConfigService,
  ) {}

  create(user: UserDocument, through: SessionThrough = SessionThrough.EMAIL) {
    const token = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    return this.sessionModel.create({
      user_id: user.id,
      token,
      through,
    });
  }

  getFromToken(token: string) {
    return this.sessionModel.findOne({
      created_at: {
        $gt:
          Date.now() -
          (Number(this.configService.get('auth.session_expires')) || 0),
      },
      token,
    });
  }

  async logout(token: string) {
    return this.sessionModel.updateOne(
      { token },
      {
        logged_out_at: new Date(),
      },
    );
  }
}
