import { IUser } from '../../user/models/user.model';

export type JwtPayload = Pick<
  IUser,
  'id' | 'role' | 'is_active' | 'email_verified_at'
> & {
  iat: number;
  exp: number;
  session_token: string;
};
