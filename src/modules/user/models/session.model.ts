import { Document, Schema, model } from 'mongoose';

export enum SessionThrough {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
}

export interface ISession extends Document {
  token: string;
  logged_out_at: Date;
  user: Schema.Types.ObjectId;
  through: SessionThrough;
}

export const SessionSchema = new Schema({
  token: { type: String, required: true },
  logged_out_at: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  through: {
    Type: String,
    enum: Object.values(SessionThrough),
  },
});

const Session = model('Session', SessionSchema);
export default Session;
