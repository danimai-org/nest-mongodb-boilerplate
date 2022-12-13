import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaRequestDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  media: string;
}
