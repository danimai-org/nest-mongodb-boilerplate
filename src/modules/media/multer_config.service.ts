import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    const client = new S3Client({
      region: this.configService.get('s3.region'),
      credentials: {
        accessKeyId: this.configService.get('s3.accessKeyId'),
        secretAccessKey: this.configService.get('s3.secretAccessKey'),
      },
    });

    return {
      storage: multerS3({
        contentType: multerS3.AUTO_CONTENT_TYPE,
        s3: client,
        bucket: this.configService.get('s3.bucket'),
        key: function (req, file, cb) {
          cb(null, `${randomStringGenerator()}${file.originalname}`);
        },
      }),
    };
  }
}
