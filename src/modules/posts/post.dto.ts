import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQuery } from '../../utils/pagination/pagination.dto';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  content: string;
}

export class UpdatePostDto {
  @ApiProperty()
  @IsString()
  content: string;
}
class PostPaginationFilter {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content: string;
}
export class PostPaginationQuery extends PaginationQuery {
  @ApiProperty({ required: false, type: PostPaginationFilter })
  @IsOptional()
  filters: PostPaginationFilter;
}
