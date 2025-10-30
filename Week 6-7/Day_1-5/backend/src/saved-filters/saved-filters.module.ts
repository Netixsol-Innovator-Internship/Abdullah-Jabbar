
// saved-filters.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SavedFilterDocument = SavedFilter & Document;

@Schema({ timestamps: true })
export class SavedFilter {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Object, required: true })
  filters: Record<string, any>;
}

export const SavedFilterSchema = SchemaFactory.createForClass(SavedFilter);

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavedFilter.name, schema: SavedFilterSchema },
    ]),
  ],
})
export class SavedFiltersModule {}