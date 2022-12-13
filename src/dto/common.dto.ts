import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetOneDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID('4')
  id: string;
}
