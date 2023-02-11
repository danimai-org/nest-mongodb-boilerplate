import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Media, { MediaDocument } from '../../../models/media.model';
import { Model } from 'mongoose';
import { IMediaService } from '../media.interface';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createReadStream, existsSync } from 'node:fs';
import { Response } from 'express';
import { join } from 'node:path';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LocalMediaService implements IMediaService<Express.Multer.File> {
  constructor(
    @InjectModel(Media.name)
    private mediaModel: Model<MediaDocument>,
  ) {}

  async create(file: Express.Multer.File) {
    if (!file) {
      throw new UnprocessableEntityException({
        media: 'Media is required field.',
      });
    }

    return this.createMedia(file);
  }

  async update(file: Express.Multer.File, media?: MediaDocument) {
    if (media) {
      await this.delete(media);
    }
    return this.create(file);
  }

  async createMedia(file: Express.Multer.File) {
    return this.mediaModel.create({
      filename: file.filename,
      url: `/${file.destination}/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    });
  }

  async delete(media: MediaDocument) {
    try {
      fs.unlinkSync(path.join(process.cwd(), media.url.replace('/v1', '')));
      await this.deleteMedia(media.id);
    } catch (e) {
      console.log(e);
    }
  }

  async get(media: MediaDocument, res: Response) {
    const file_path = join(process.cwd(), media.url);

    if (!existsSync(file_path)) {
      throw new NotFoundException();
    }
    const file = createReadStream(file_path);
    res.setHeader('content-type', media.mimetype);
    file.pipe(res);
  }

  async deleteMedia(id: string) {
    await this.mediaModel.remove({ _id: id });
  }
}
