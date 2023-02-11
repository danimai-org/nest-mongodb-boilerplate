import { UserDocument } from '../../../models/user.model';

export type JwtPayload = Pick<
  UserDocument,
  'id' | 'role' | 'is_active' | 'email_verified_at'
> & {
  iat: number;
  exp: number;
  session_token: string;
};
