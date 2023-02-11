import { Response } from 'express';
import { MediaDocument } from '../../models/media.model';

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
  create: (file: T) => Promise<MediaDocument>;
  update: (file: T, media?: MediaDocument) => Promise<MediaDocument>;
  delete: (media: MediaDocument) => Promise<void>;
  get: (media: MediaDocument, res: Response) => Promise<void>;
}
