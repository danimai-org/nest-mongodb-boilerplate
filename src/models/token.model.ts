import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import User from './user.model';

export enum TokenType {
  REGISTER_VERIFY = 'REGISTER_VERIFY',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export default class Token {
  @Prop()
  token: string;

  @Prop({ default: false })
  is_used: boolean;

  @Prop({ type: String, enum: TokenType, default: TokenType.REGISTER_VERIFY })
  type: TokenType;

  @Prop()
  expires_at: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
