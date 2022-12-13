import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './controllers';
import { Media } from './entities';
import { MediaService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Media]), ConfigModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
