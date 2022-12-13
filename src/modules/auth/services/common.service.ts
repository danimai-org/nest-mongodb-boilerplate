import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserSession } from '../../user/entities';
import { TokenService } from '../../user/services';
import { ResetPasswordRequestDto } from '../dto/common.request.dto';

@Injectable()
export class CommonService {
  constructor(private tokenService: TokenService) {}

  async resetPassword(resetPasswordDto: ResetPasswordRequestDto) {
    try {
      const user = await this.tokenService.verify(
        resetPasswordDto.reset_token,
        'RESET_PASSWORD',
      );
      user.password = resetPasswordDto.password;
      await user.save();
    } catch (e) {
      throw new HttpException(
        { reset_token: e.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async logout(session: UserSession) {
    session.logged_out_at = new Date();
    await session.save();
  }
}
