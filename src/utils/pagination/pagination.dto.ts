import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PaginationQuery {
  @ApiProperty({
    minimum: 1,
    title: 'Page',
    exclusiveMaximum: true,
    exclusiveMinimum: true,
    default: 1,
    type: 'integer',
    required: false,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiProperty({
    minimum: 10,
    maximum: 50,
    title: 'Limit',
    default: 10,
    type: 'integer',
    required: false,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @Transform(({ value }) => (value > 50 ? 50 : value))
  @Transform(({ value }) => (value < 10 ? 10 : value))
  @IsInt()
  @Min(10)
  @Max(50)
  limit = 10;

  @ApiProperty({
    title: 'Search',
    required: false,
  })
  @IsOptional()
  @IsString()
  search: string;
}

export class PaginationResponse<T> {
  @ApiProperty({
    title: 'Data',
    isArray: true,
  })
  readonly rows: T[];

  @ApiProperty({
    title: 'Total',
  })
  readonly count: number = 0;

  @ApiProperty({
    title: 'Page',
  })
  readonly page: number = 1;

  @ApiProperty({
    title: 'Limit',
  })
  readonly limit: number = 10;

  @ApiProperty({
    title: 'Has Previous Page',
  })
  readonly hasPreviousPage: boolean = false;

  @ApiProperty({
    title: 'Has Next Page',
  })
  readonly hasNextPage: boolean = false;

  constructor(data: T[], total: number, paginationQuery: PaginationQuery) {
    const { limit, page } = paginationQuery;
    this.rows = data;
    this.page = page;
    this.limit = limit;
    this.count = total;
    if (total > page * limit) {
      this.hasNextPage = true;
    }
    if (page > 1) {
      this.hasPreviousPage = true;
    }
  }
}
