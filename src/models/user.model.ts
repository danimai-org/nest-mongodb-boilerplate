import * as bcrypt from 'bcryptjs';
import { RoleType } from '../constants/role-type';
import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import Media from './media.model';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema()
export default class User {
  @Prop()
  @ApiProperty()
  first_name: string;

  @Prop()
  @ApiProperty()
  last_name: string;

  @Prop()
  @ApiProperty()
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop()
  @ApiProperty()
  is_active: boolean;

  @Prop()
  @ApiProperty()
  role: RoleType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Media' })
  @ApiProperty()
  avatar?: Media;

  @Prop()
  @ApiProperty({ format: 'datetime' })
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
