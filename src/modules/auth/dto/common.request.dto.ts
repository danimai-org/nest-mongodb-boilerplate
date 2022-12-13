import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsPassword } from '../../../utils/validator';

export class ResetPasswordRequestDto {
  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @IsPassword()
  password: string;

  @ApiProperty({ example: 'vhsbdjsdfsd-dfmsdfjsd-sdfnsdk' })
  @IsString()
  reset_token: string;
}
