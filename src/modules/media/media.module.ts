import { Module } from '@nestjs/common';
import { MediaController } from './controllers';
import Media, { MediaSchema } from '../../models/media.model';
import { LocalMediaService, MediaService, S3MediaService } from './services';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
  ],
  controllers: [MediaController],
  providers: [MediaService, S3MediaService, LocalMediaService],
  exports: [MediaService],
})
export class MediaModule {}
