import appConfig from '../config/app.config';
import authConfig from '../config/auth.config';
import databaseConfig from '../config/database.config';
import googleConfig from '../config/google.config';
import mailConfig from '../config/mail.config';
import s3Config from '../config/s3.config';
import storageConfig from '../config/storage.config';

export default [
  appConfig,
  databaseConfig,
  mailConfig,
  s3Config,
  authConfig,
  storageConfig,
  googleConfig,
];
