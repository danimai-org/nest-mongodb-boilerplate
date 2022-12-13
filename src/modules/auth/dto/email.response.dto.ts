import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'vhsbdjsdfsd-dfmsdfjsd-sdfnsdk' })
  auth_token: string;
}
