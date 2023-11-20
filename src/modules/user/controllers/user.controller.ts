import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserParam } from '../../auth/decorators';
import { JwtPayload } from '../../auth/strategies/jwt.interface';
import { UpdateUserRequestDto } from '../dto/user.request.dto';
import { GetUserResponseDto } from '../dto/user.response.dto';
import { UserService } from '../services';

@ApiBearerAuth()
@ApiTags('User')
@Controller({
  path: 'user',
  version: '1',
})
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  @ApiOkResponse({
    description: 'Get logged In user',
    type: GetUserResponseDto,
  })
  @ApiOperation({
    summary: 'Get logged in user',
  })
  async me(@UserParam() payload: JwtPayload) {
    return [];
  }

  @Patch('/me')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update logged In user',
    type: GetUserResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'update logged in user',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      dest: 'media/user',
    }),
  )
  async update(
    @UserParam() payload: JwtPayload,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() updateDto: UpdateUserRequestDto,
  ) {
    return this.userService.update(payload, avatar, updateDto);
  }
}
