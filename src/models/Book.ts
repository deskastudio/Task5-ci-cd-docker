import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  code: string;
  author: string;
  publishedDate: Date;
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  publishedDate: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model<IBook>('Book', BookSchema);
