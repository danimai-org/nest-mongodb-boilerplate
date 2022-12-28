import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Media, { IMedia } from '../models/media.model';
import { Response } from 'express';
import { Model } from 'mongoose';
import { IMediaService, S3File } from '../media.interface';
import { S3MediaService } from './s3.service';
import { LocalMediaService } from './local.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MediaService {
  service: IMediaService<Express.Multer.File | S3File>;

  constructor(
    @InjectModel(Media.name)
    private mediaModel: Model<IMedia>,
    configService: ConfigService,
    s3Service: S3MediaService,
    localService: LocalMediaService,
  ) {
    if (configService.get('storage.type') === 's3') {
      this.service = s3Service;
    } else {
      this.service = localService;
    }
  }

  async create(file: S3File | Express.Multer.File) {
    return this.service.create(file);
  }

  async update(file: S3File | Express.Multer.File, id?: string) {
    let media: IMedia;
    if (id) {
      media = await this.mediaModel.findById(id);
    }
    return this.service.update(file, media);
  }

  async delete(id: string) {
    const media = await this.mediaModel.findById(id);
    if (media) {
      await this.service.delete(media);
    }
  }

  async get(media: IMedia, res: Response) {
    await this.service.get(media, res);
  }
}
