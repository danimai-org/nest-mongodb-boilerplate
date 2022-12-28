import { Response } from 'express';
import { IMedia } from './models/media.model';

export interface S3File extends Express.Multer.File {
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition: null;
  storageClass: string;
  serverSideEncryption: null;
  metadata: any;
  location: string;
  etag: string;
}

export interface IMediaService<T> {
  create: (file: T) => Promise<IMedia>;
  update: (file: T, media?: IMedia) => Promise<IMedia>;
  delete: (media: IMedia) => Promise<void>;
  get: (media: IMedia, res: Response) => Promise<void>;
}
