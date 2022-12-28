import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Document, Schema, model } from 'mongoose';

export enum TokenType {
  REGISTER_VERIFY = 'REGISTER_VERIFY',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export interface IToken extends Document {
  token: string;
  is_used: boolean;
  type: TokenType;
  expires_at: Date;
  user: Schema.Types.ObjectId;
}

export const TokenSchema = new Schema({
  token: { type: String, required: true },
  is_used: { type: Boolean, default: false },
  type: { type: String, enum: TokenType, required: true },
  expired_at: { type: Date },
  user: { type: 'ObjectId', required: true, ref: 'User' },
});

TokenSchema.pre('save', function () {
  this.token = `${randomStringGenerator()}-${randomStringGenerator()}`;
});

const Token = model('Token', TokenSchema);
export default Token;
