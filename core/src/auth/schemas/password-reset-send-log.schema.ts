import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PasswordResetSendLogDocument =
  HydratedDocument<PasswordResetSendLog>;

/** Rate limit rows for password-reset emails. */
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class PasswordResetSendLog {
  @Prop({ required: true, lowercase: true, trim: true, index: true })
  email: string;
}

export const PasswordResetSendLogSchema =
  SchemaFactory.createForClass(PasswordResetSendLog);

PasswordResetSendLogSchema.index({ email: 1, createdAt: -1 });
