import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import Token, { TokenDocument, TokenType } from '../../../models/token.model';
import User, { UserDocument } from '../../../models/user.model';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(
    user: UserDocument,
    type: keyof typeof TokenType = 'REGISTER_VERIFY',
    expires_at: Date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  ) {
    return this.tokenModel.create({
      user: user.id,
      type: TokenType[type],
      expires_at,
    });
  }

  async verify(token: string, type: keyof typeof TokenType) {
    const tokenEntity = await this.tokenModel.findOne({
      token,
      type: TokenType[type],
      is_used: false,
    });

    if (!tokenEntity) {
      throw new Error('Token not found');
    }
    if (tokenEntity.expires_at < new Date()) {
      throw new Error('Token expired');
    }
    tokenEntity.is_used = true;
    await tokenEntity.save();
    return this.userModel.findById(tokenEntity.user);
  }
}
