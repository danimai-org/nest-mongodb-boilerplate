import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MediaDocument = HydratedDocument<Media>;

@Schema()
export default class Media {
  @Prop()
  filename: string;

  @Prop()
  url: string;

  @Prop()
  mimetype: string;

  @Prop()
  size: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
