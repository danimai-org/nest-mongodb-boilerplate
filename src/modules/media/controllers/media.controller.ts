import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetOneDto } from '../../../dto/common.dto';
import { Media } from '../entities';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from '../services';
import { CreateMediaRequestDto } from '../dto/media.request.dto';

@ApiTags('Media')
@Controller({
  path: 'media',
  version: '1',
})
export class MediaController {
  constructor(
    @InjectRepository(Media)
    private mediaRespository: Repository<Media>,
    private mediaService: MediaService,
  ) {}

  @Get(':id')
  async getOne(@Res() res: Response, @Param() getOneDto: GetOneDto) {
    const { id } = getOneDto;
    const media = await this.mediaRespository.findOneBy({ id });

    if (!media) {
      throw new NotFoundException();
    }
    const file_path = join(process.cwd(), media.url);

    if (!existsSync(file_path)) {
      throw new NotFoundException();
    }
    const file = createReadStream(file_path);
    res.setHeader('content-type', media.mimetype);
    file.pipe(res);
    // res.sendFile(file_path);
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
    if (!media) {
      throw new UnprocessableEntityException({
        media: 'Media is required field.',
      });
    }
    return this.mediaService.create(media);
  }
}
