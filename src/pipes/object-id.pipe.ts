import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  constructor(
    private readonly model: any,
    private readonly field: any = '_id',
  ) {}

  transform(value: any) {
    return this.model.findOne({
      [this.field]: value,
    });
  }
}
