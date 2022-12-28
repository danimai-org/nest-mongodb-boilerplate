import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SessionService } from '../../user/services';
import { UserParam } from '../decorators';
import { ResetPasswordRequestDto } from '../dto/common.request.dto';
import { CommonService } from '../services';
import { JwtPayload } from '../strategies/jwt.interface';

@ApiTags('Auth Common')
@Controller({
  path: 'auth',
  version: '1',
})
export class CommonController {
  constructor(
    private commonService: CommonService,
    private sessionService: SessionService,
  ) {}

  @Post('/reset-password')
  @ApiOperation({ summary: 'Password Reset.' })
  @ApiNoContentResponse({
    description: 'Password Reset Successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Reset token',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordRequestDto) {
    return this.commonService.resetPassword(resetPasswordDto);
  }

  @Get('/logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Log out user.' })
  @ApiNoContentResponse({
    description: 'Log out Successfully.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@UserParam() jwtPayload: JwtPayload) {
    await this.sessionService.logout(jwtPayload.session_token);
  }
}
