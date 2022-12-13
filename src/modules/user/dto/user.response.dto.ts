import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponseDto {
  @ApiProperty({
    example: 'hjkdwdjmkw-enemf',
  })
  id: number;

  @ApiProperty({
    example: 'example@danimai.com',
  })
  email: string;

  @ApiProperty({
    example: 'Danimai',
  })
  first_name: string;

  @ApiProperty({
    example: 'Mandal',
  })
  last_name: string;

  @ApiProperty({
    example: 'hjkdwdjmkw-enemf',
  })
  profile_id: number;
}
