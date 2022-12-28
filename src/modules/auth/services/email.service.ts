import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MailService } from '../../mail/services/mail.service';
import { UserService, TokenService } from '../../user/services';
import {
  EmailVerifyRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
  SendVerifyMailRequestDto,
} from '../dto/email.request.dto';

@Injectable()
export class EmailService {
  constructor(
    private mailService: MailService,
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterRequestDto) {
    const user = await this.userService.create(registerDto);
    const token = await this.tokenService.create(user, 'REGISTER_VERIFY');
    await this.mailService.user_registation({
      to: user.email,
      data: {
        hash: token.token,
      },
    });
  }

  async verify(verifyDto: EmailVerifyRequestDto) {
    try {
      const user = await this.tokenService.verify(
        verifyDto.verify_token,
        'REGISTER_VERIFY',
      );
      user.email_verified_at = new Date();
      user.is_active = true;
      await user.save();
    } catch (e) {
      throw new HttpException(
        { verify_token: e.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(loginDto: LoginRequestDto) {
    const user = await this.userService.findOne({
      where: { email: loginDto.email.toLowerCase() },
    });

    if (!user) {
      throw new HttpException(
        { email: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    if (!user.is_active) {
      throw new HttpException(
        { email: 'User not active' },
        HttpStatus.FORBIDDEN,
      );
    }
    if (!user.email_verified_at) {
      throw new HttpException(
        { email: 'User not verified' },
        HttpStatus.FORBIDDEN,
      );
    }
    if (!user.checkPassword(loginDto.password)) {
      throw new HttpException(
        { password: 'Password is incorrect' },
        HttpStatus.FORBIDDEN,
      );
    }
    const jwtToken = await this.userService.login(user);
    return { auth_token: jwtToken };
  }

  async sendVerifyMail(sendVerifyMailDto: SendVerifyMailRequestDto) {
    const user = await this.userService.findOne({
      where: { email: sendVerifyMailDto.email.toLowerCase() },
    });

    if (!user) {
      throw new HttpException(
        { email: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.email_verified_at) {
      throw new HttpException(
        { email: 'User already verified' },
        HttpStatus.FORBIDDEN,
      );
    }
    const token = await this.tokenService.create(user, 'REGISTER_VERIFY');
    await this.mailService.user_registation({
      to: user.email,
      data: {
        hash: token.token,
      },
    });
  }

  async sendForgotMail(sendForgotMailDto: SendVerifyMailRequestDto) {
    const user = await this.userService.findOne({
      where: { email: sendForgotMailDto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnprocessableEntityException({ email: 'User not found' });
    }

    if (!user.email_verified_at) {
      throw new HttpException(
        { email: 'Please verify email first.' },
        HttpStatus.FORBIDDEN,
      );
    }

    const token = await this.tokenService.create(user, 'RESET_PASSWORD');
    await this.mailService.forgot_password({
      to: user.email,
      data: {
        hash: token.token,
      },
    });
  }
}
