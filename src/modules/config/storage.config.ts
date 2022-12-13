import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  type: process.env.STORAGE_TYPE,
}));
