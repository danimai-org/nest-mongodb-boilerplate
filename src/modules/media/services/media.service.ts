import { S3 } from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media, StorageType } from '../entities';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class MediaService {
  client: S3;
  storageType: StorageType;

  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private configService: ConfigService,
  ) {
    if (this.configService.get('storage.type') === 'S3') {
      this.client = new S3({
        region: this.configService.get('s3.region'),
        credentials: {
          accessKeyId: this.configService.get('s3.accessKeyId'),
          secretAccessKey: this.configService.get('s3.secretAccessKey'),
        },
      });
    }
    this.storageType = this.configService.get('storage.type');
  }

  async create(file: unknown): Promise<Media> {
    if (this.storageType === StorageType.LOCAL) {
      const new_file = file as Express.Multer.File;

      return this.mediaRepository
        .create({
          filename: new_file.filename,
          url: `/${new_file.destination}/${new_file.filename}`,
          mimetype: new_file.mimetype,
          size: new_file.size,
          storage_type: this.storageType,
        })
        .save();
    } else if (this.storageType === StorageType.S3) {
      const new_file = file as any;

      return this.mediaRepository
        .create({
          filename: new_file.key,
          url: new_file.location,
          mimetype: new_file.contentType,
          size: new_file.size,
          storage_type: this.storageType,
        })
        .save();
    }
  }

  async update(file: Express.Multer.File, id?: string) {
    if (id) {
      const media = await this.mediaRepository.findOneBy({ id });
      if (this.storageType === StorageType.S3) {
        await this.deleteS3(media);
      } else if (this.storageType === StorageType.LOCAL) {
        await this.deleteLocal(media);
      }
    }
    return this.create(file);
  }

  async deleteS3(media: Media) {
    try {
      await this.client.deleteObject({
        Bucket: this.configService.get('s3.bucket'),
        Key: media.filename,
      });
      await this.deleteMedia(media.id);
    } catch (e) {
      throw new HttpException(
        'Unable to delete the media',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async deleteMedia(id: string) {
    await this.mediaRepository.delete(id);
  }

  async deleteLocal(media: Media) {
    try {
      fs.unlinkSync(path.join(process.cwd(), media.url.replace('/v1', '')));
      await this.mediaRepository.delete(media.id);
    } catch (e) {
      // throw new HttpException(
      //   'Unable to delete the media',
      //   HttpStatus.SERVICE_UNAVAILABLE,
      // );
    }
  }
}
