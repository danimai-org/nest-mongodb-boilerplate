import { User } from '../../user/entities';

export type JwtPayload = Pick<
  User,
  'id' | 'role' | 'is_active' | 'email_verified_at'
> & {
  iat: number;
  exp: number;
  session_token: string;
};
