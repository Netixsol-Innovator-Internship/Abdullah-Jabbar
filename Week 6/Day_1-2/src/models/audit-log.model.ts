import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  collectionName?: string;
  documentId?: Types.ObjectId;
  changes?: Record<string, any>;
  performedBy?: Types.ObjectId;
  meta?: Record<string, any>;
  createdAt?: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true },
    collectionName: String,
    documentId: Schema.Types.ObjectId,
    changes: { type: Schema.Types.Mixed },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLogModel = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);