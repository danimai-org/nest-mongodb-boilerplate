import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsPassword } from '../../../utils/validator';
import { IsNotExist } from '../../../utils/validator/is_not_exists.validator';
import { User } from '../../user/entities';

export class RegisterRequestDto {
  @ApiProperty({ example: 'example@danimai.com' })
  @IsEmail()
  @IsNotExist({ repository: User, pathToProperty: 'email' })
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @IsPassword()
  password: string;

  @ApiProperty({ example: 'Danimai' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Mandal' })
  @IsString()
  @IsNotEmpty()
  last_name: string;
}

export class EmailVerifyRequestDto {
  @ApiProperty({ example: 'vhsbdjsdfsd-dfmsdfjsd-sdfnsdk' })
  @IsString()
  verify_token: string;
}

export class LoginRequestDto {
  @ApiProperty({ example: 'example@danimai.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @IsPassword()
  password: string;
}

export class SendVerifyMailRequestDto {
  @ApiProperty({ example: 'example@danimai.com' })
  @IsEmail()
  email: string;
}
