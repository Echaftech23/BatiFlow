import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpSendLogDocument = HydratedDocument<OtpSendLog>;

/** One row per OTP email issuance for throttling. */
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class OtpSendLog {
  @Prop({ required: true, lowercase: true, trim: true, index: true })
  email: string;
}

export const OtpSendLogSchema = SchemaFactory.createForClass(OtpSendLog);

OtpSendLogSchema.index({ email: 1, createdAt: -1 });
