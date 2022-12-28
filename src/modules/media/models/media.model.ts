import { Document, Schema, model } from 'mongoose';

export interface IMedia extends Document {
  filename: string;
  url: string;
  mimetype: string;
  size: string;
}

export const MediaSchema = new Schema<IMedia>({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: String, required: true },
});

const Media = model<IMedia>('Media', MediaSchema);

export default Media;
