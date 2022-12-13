import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { configs } from '../../ormconfig.test';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...configs,
      database: process.env.TEST_DATABASE_NAME,
      autoLoadEntities: true,
      keepConnectionAlive: true,
    } as TypeOrmModuleOptions;
  }
}
