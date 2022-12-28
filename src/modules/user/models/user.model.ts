import * as bcrypt from 'bcryptjs';
import { RoleType } from '../../../contants/role-type';
import { Document, Schema, model, models } from 'mongoose';

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  is_active: boolean;
  role: RoleType;
  avatar?: Schema.Types.ObjectId;
  email_verified_at: Date;
  full_name: string;
  checkPassword: (password: string) => boolean;
}

export const UserSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    role: {
      type: String,
      enum: Object.values(RoleType),
      default: RoleType.USER,
    },
    avatar: { type: Schema.Types.ObjectId, ref: 'Media' },
    email_verified_at: { type: Date, default: null },
  },
  {},
);

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) next();
  this.password = bcrypt.hashSync(this.password);
  next();
});

UserSchema.virtual('full_name').get(function (this) {
  return `${this.first_name} ${this.last_name}`;
});

UserSchema.methods.checkPassword = function (this: IUser, password: string) {
  return bcrypt.compareSync(password, this.password);
};

console.log(models);
const User = model<IUser>('User', UserSchema);
console.log(User, 'test');
export default User;
