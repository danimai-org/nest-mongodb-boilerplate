import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BaseService } from '../services';
import {
  ArgumentMetadata,
  Injectable,
  Query,
  Type,
  UsePipes,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { PaginationQuery } from '../../utils/pagination/pagination.dto';
import { ApiPaginatedResponse } from '../../utils/pagination/pagination.decorators';

@Injectable()
export class AbstractValidationPipe extends ValidationPipe {
  constructor(
    options: ValidationPipeOptions,
    private readonly targetTypes: {
      body?: Type<any>;
      query?: Type<any>;
      param?: Type<any>;
    },
  ) {
    super(options);
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const targetType = this.targetTypes[metadata.type];
    if (!targetType) {
      return super.transform(value, metadata);
    }
    return super.transform(value, { ...metadata, metatype: targetType });
  }
}

export interface ClassType<T = any> {
  new (): T;
}

export const ControllerFactory = <
  Model extends ClassType,
  CreateDto extends ClassType,
  UpdateDto extends ClassType,
  QueryDto = PaginationQuery,
>(
  model: Model,
  createDto: CreateDto,
  updateDto: UpdateDto,
  queryDto: QueryDto = PaginationQuery as unknown as QueryDto,
): any => {
  const queryPipe = new AbstractValidationPipe(
    { whitelist: true, transform: true },
    { query: queryDto as any },
  );
  const createPipe = new AbstractValidationPipe(
    { whitelist: true, transform: true },
    { body: createDto as any },
  );
  const updatePipe = new AbstractValidationPipe(
    { whitelist: true, transform: true },
    { body: updateDto as any },
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  class ModelInstance extends (model as any) {
    @ApiProperty()
    _id: string;
  }

  abstract class BaseController {
    protected abstract readonly service: BaseService<Model>;

    @Get()
    @UsePipes(queryPipe)
    @ApiQuery({ type: queryDto as unknown as ClassType })
    @ApiPaginatedResponse({ type: model as any })
    async getAll(@Query() query: any) {
      return this.service.getAll(query);
    }

    @Get(':id')
    @ApiOkResponse({ type: ModelInstance })
    async get(@Param('id') id: string) {
      return this.service.getOne(id);
    }

    @Post()
    @UsePipes(createPipe)
    @ApiBody({ type: createDto })
    @ApiOkResponse({ type: ModelInstance })
    async post(@Body() dto: CreateDto) {
      return this.service.create(dto);
    }

    @Delete()
    async delete(@Param('id') _id: string): Promise<void> {
      await this.service.delete(_id);
    }

    @Patch(':id')
    @UsePipes(updatePipe)
    @ApiOkResponse({ type: ModelInstance })
    @ApiBody({ type: updateDto })
    async update(@Param('id') _id: string, @Body() dto: UpdateDto) {
      return this.service.update(_id, dto);
    }
  }

  return BaseController;
};
