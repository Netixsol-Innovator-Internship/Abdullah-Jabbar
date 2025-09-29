import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatchDocument = Match & Document;

@Schema({ timestamps: true })
export class Match {
  @Prop({ required: true, index: true })
  format: 'test' | 'odi' | 't20';

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

export const MatchSchema = SchemaFactory.createForClass(Match);

// Indexes: helpful for common queries
MatchSchema.index({ format: 1, team: 1, start_date: -1 });
MatchSchema.index({ team: 1, opposition: 1 });
