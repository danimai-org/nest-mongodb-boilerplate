import { S3 } from '@aws-sdk/client-s3';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Media, { MediaDocument } from '../../../models/media.model';
import { Model } from 'mongoose';
import { IMediaService, S3File } from '../media.interface';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class S3MediaService implements IMediaService<S3File> {
  client: S3;
  storageType: string;

  constructor(
    @InjectModel(Media.name)
    private mediaModel: Model<MediaDocument>,
    private configService: ConfigService,
  ) {
    this.storageType = configService.get('storage.type');
    if (this.storageType === 's3') {
      const config = {
        region: this.configService.get('s3.region'),
        credentials: {
          accessKeyId: this.configService.get('s3.accessKeyId'),
          secretAccessKey: this.configService.get('s3.secretAccessKey'),
        },
      };
      this.client = new S3(config);
    }
  }

  async create(file: S3File) {
    if (!file) {
      throw new UnprocessableEntityException({
        media: 'Media is required field.',
      });
    }

    return this.createS3(file);
  }

  async update(file: S3File, media?: MediaDocument) {
    if (media) {
      await this.delete(media);
    }
    return this.create(file);
  }

  async delete(media: MediaDocument) {
    try {
      await this.client.deleteObject({
        Bucket: this.configService.get('s3.bucket'),
        Key: media.filename,
      });
      await this.deleteMedia(media.id);
    } catch (e) {
      console.log(e);
    }
  }

  async get(media: MediaDocument, res: Response) {
    try {
      res.setHeader('content-type', media.mimetype);
      const s3Res = await this.client.getObject({
        Bucket: this.configService.get('s3.bucket'),
        Key: media.filename,
      });

      (s3Res.Body as any).pipe(res);
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  async createS3(file: S3File) {
    return this.mediaModel.create({
      filename: file.key,
      url: file.location,
      mimetype: file.contentType,
      size: file.size,
    });
  }
  async deleteMedia(id: string) {
    await this.mediaModel.remove({ _id: id });
  }
}
