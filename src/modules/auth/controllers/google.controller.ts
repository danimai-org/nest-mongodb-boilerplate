import {
  Controller,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GoogleOAuthRequestDto } from '../dto/google.request.dto';
import { GoogleAuthenticationService } from '../services';

@Controller({ path: 'google-authentication', version: '1' })
@ApiTags('Auth Google')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  @ApiOkResponse({
    description: 'Login with google',
  })
  async authenticate(@Body() tokenData: GoogleOAuthRequestDto) {
    return this.googleAuthenticationService.authenticate(tokenData.token);
  }
}
