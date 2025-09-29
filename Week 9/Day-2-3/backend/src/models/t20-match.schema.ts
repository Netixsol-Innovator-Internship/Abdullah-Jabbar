import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type T20MatchDocument = T20Match & Document;

@Schema({ timestamps: true })
export class T20Match {
  @Prop({ required: true, index: true })
  team: string;

  // Normalized fields from Score column
  @Prop()
  runs?: number;

  @Prop()
  wickets?: number;

  // Normalized fields from Overs column
  @Prop()
  overs?: number;

  @Prop()
  balls?: number;

  @Prop()
  balls_per_over?: number;

  @Prop()
  rpo?: number;

  @Prop()
  inns?: number;

  @Prop()
  result?: string;

  @Prop()
  opposition?: string;

  @Prop()
  ground?: string;

  @Prop({ type: Date, index: true })
  start_date?: Date;

  @Prop({ type: Object, default: {} })
  extra_cols?: Record<string, any>;
}

export const T20MatchSchema = SchemaFactory.createForClass(T20Match);

// Indexes: helpful for common queries
T20MatchSchema.index({ team: 1, start_date: -1 });
T20MatchSchema.index({ team: 1, opposition: 1 });
