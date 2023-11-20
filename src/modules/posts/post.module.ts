import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema, Post } from '../../models/post.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: PostSchema, name: Post.name }]),
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
