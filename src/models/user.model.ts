import * as bcrypt from 'bcryptjs';
import { RoleType } from '../constants/role-type';
import mongoose, { HydratedDocument, model, models } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import Media from './media.model';

export type UserDocument = HydratedDocument<User>;

@Schema()
export default class User {
  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop()
  is_active: boolean;

  @Prop()
  role: RoleType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Media' })
  avatar?: Media;

  @Prop()
  email_verified_at: Date;

  full_name: string;
  checkPassword: (password: string) => boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('full_name').get(function (this) {
  return `${this.first_name} ${this.last_name}`;
});

UserSchema.methods.checkPassword = function (
  this: UserDocument,
  password: string,
) {
  return bcrypt.compareSync(password, this.password);
};
