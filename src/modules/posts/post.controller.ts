import { ControllerFactory } from '../../core/controllers';
import { Post } from '../../models/post.model';
import { CreatePostDto, PostPaginationQuery, UpdatePostDto } from './post.dto';
import { PostService } from './post.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'posts',
  version: '1',
})
@ApiTags('Posts')
export class PostController extends ControllerFactory(
  Post,
  CreatePostDto,
  UpdatePostDto,
  PostPaginationQuery,
) {
  constructor(protected readonly service: PostService) {
    super();
  }
}
