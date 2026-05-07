import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpChallengeDocument = HydratedDocument<OtpChallenge>;

export const OTP_PURPOSE_REGISTER = 'register' as const;
export type OtpPurpose = typeof OTP_PURPOSE_REGISTER;

@Schema({ timestamps: true })
export class OtpChallenge {
  @Prop({ required: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true })
  codeHash: string;

  @Prop({ required: true, index: true })
  expiresAt: Date;

  @Prop({ default: 0 })
  attempts: number;

  @Prop({ required: true, enum: [OTP_PURPOSE_REGISTER] })
  purpose: OtpPurpose;
}

export const OtpChallengeSchema = SchemaFactory.createForClass(OtpChallenge);

OtpChallengeSchema.index({ email: 1, purpose: 1 });
