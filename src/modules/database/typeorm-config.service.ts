import { Injectable } from '@nestjs/common';
import { configs } from './datasource';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...configs,
      autoLoadEntities: true,
      keepConnectionAlive: true,
    } as TypeOrmModuleOptions;
  }
}
