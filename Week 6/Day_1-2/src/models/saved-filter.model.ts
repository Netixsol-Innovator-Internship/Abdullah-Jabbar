import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISavedFilter extends Document {
  userId: Types.ObjectId;
  name: string;
  filters: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

const SavedFilterSchema = new Schema<ISavedFilter>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    filters: { type: Schema.Types.Mixed, required: true }, // e.g. { priceRange: [50,200], colors: [...], sizes: [...] }
  },
  { timestamps: true }
);

export const SavedFilterModel = mongoose.model<ISavedFilter>('SavedFilter', SavedFilterSchema);