import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import User from './user.model';

export enum SessionThrough {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
}

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export default class Session {
  @Prop()
  token: string;

  @Prop()
  logged_out_at: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: String, enum: SessionThrough, default: SessionThrough.EMAIL })
  through: SessionThrough;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
