import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from '../services';
import { CreateMediaRequestDto } from '../dto/media.request.dto';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { ParseObjectIdPipe } from '../../../pipes/object-id.pipe';
import Media, { MediaDocument } from '../../../models/media.model';

@ApiTags('Media')
@Controller({
  path: 'media',
  version: '1',
})
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get(':id')
  async getOne(
    @Res() res: Response,
    @Param('id', new ParseObjectIdPipe(Media)) media: MediaDocument,
  ) {
    await this.mediaService.get(media, res);
  }

  @ApiCreatedResponse()
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('media', {
      dest: 'media/common',
    }),
  )
  async create(
    @Body() createDto: CreateMediaRequestDto,
    @UploadedFile() media: Express.Multer.File,
  ) {
    return this.mediaService.create(media);
  }
}
