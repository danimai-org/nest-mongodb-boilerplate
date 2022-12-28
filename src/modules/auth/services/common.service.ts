import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenService } from '../../user/services';
import { ResetPasswordRequestDto } from '../dto/common.request.dto';
import { ISession } from '../../user/models/session.model';

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

  async logout(session: ISession) {
    session.logged_out_at = new Date();
    await session.save();
  }
}
