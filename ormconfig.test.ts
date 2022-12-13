import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

export const configs: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.TEST_DATABASE_NAME,
  entities: [__dirname + '/src/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/src/modules/database/migrations/*{.ts,.js}'],
  synchronize: true,
  dropSchema: false,
  logging: false,
};
const dataSource = new DataSource(configs);
void dataSource.initialize();
export default dataSource;
