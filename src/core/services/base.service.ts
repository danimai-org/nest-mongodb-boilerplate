import { Model } from 'mongoose';
import { PaginationQuery } from '../../utils/pagination/pagination.dto';

export abstract class BaseService<T extends Record<any, any>> {
  protected abstract readonly model: Model<T>;

  async getAll(query: PaginationQuery): Promise<T[]> {
    return this.model.find();
  }

  async getOne(_id: string): Promise<T> {
    return this.model.findById(_id);
  }

  async create(dto: any): Promise<T> {
    return this.model.create(dto);
  }

  async update(_id: string, dto: any): Promise<void> {
    await this.model.updateOne({ _id }, dto);
  }

  async delete(_id: string): Promise<void> {
    await this.model.deleteOne({ _id });
  }
}
