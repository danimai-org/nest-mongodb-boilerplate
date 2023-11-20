import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import User from './user.model';
import { ApiProperty } from '@nestjs/swagger';

export type PostDocument = Document<Post>;

@Schema()
export class Post {
  @ApiProperty()
  @Prop()
  content: string;

  @ApiProperty({ type: () => User })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
