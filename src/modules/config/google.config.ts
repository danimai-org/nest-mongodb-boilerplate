import { registerAs } from '@nestjs/config';

export default registerAs('google_auth', () => ({
  client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
  client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
}));
