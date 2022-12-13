import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  EmailVerifyRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
  SendVerifyMailRequestDto,
} from '../dto/email.request.dto';
import { LoginResponseDto } from '../dto/email.response.dto';
import { EmailService } from '../services';

@ApiTags('Auth Email')
@Controller({
  path: 'auth/email',
  version: '1',
})
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register by email' })
  @ApiCreatedResponse({
    description: 'User successfully registered.',
  })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterRequestDto): Promise<void> {
    return this.emailService.register(registerDto);
  }

  @Post('/verify')
  @ApiOperation({ summary: 'Verify Email address.' })
  @ApiAcceptedResponse({
    description: 'Email verified successfully.',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async verify(@Body() emailVerifyDto: EmailVerifyRequestDto): Promise<void> {
    return this.emailService.verify(emailVerifyDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Log in with Email.' })
  @ApiOkResponse({
    description: 'Logged in with Email Successfully.',
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.emailService.login(loginDto);
  }

  @Post('/send-verify-email')
  @ApiOperation({ summary: 'Send Verification mail.' })
  @ApiNoContentResponse({
    description: 'Sent Verification mail.',
  })
  @ApiForbiddenResponse({
    description: 'User already verified.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendVerifyMail(@Body() sendVerifyMailDto: SendVerifyMailRequestDto) {
    return this.emailService.sendVerifyMail(sendVerifyMailDto);
  }

  @Post('/reset-password-request')
  @ApiOperation({ summary: 'Send Reset Password mail.' })
  @ApiNoContentResponse({
    description: 'Sent Reset Password mail.',
  })
  @ApiForbiddenResponse({
    description: 'Please verify email first.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendForgotMail(@Body() sendForgotMailDto: SendVerifyMailRequestDto) {
    return this.emailService.sendForgotMail(sendForgotMailDto);
  }
}
