import { Model, Document, Types } from 'mongoose';
import { BaseService } from '../../core/services';
import { PostDocument, Post } from '../../models/post.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostService extends BaseService<Post> {
  constructor(@InjectModel(Post.name) protected readonly model: Model<Post>) {
    super();
  }
}
