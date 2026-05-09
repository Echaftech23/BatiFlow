import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PasswordResetChallengeDocument =
  HydratedDocument<PasswordResetChallenge>;

@Schema({ timestamps: true })
export class PasswordResetChallenge {
  @Prop({ required: true, lowercase: true, trim: true, unique: true })
  email: string;

  @Prop({ required: true })
  codeHash: string;

  @Prop({ required: true, index: true })
  expiresAt: Date;

  @Prop({ default: 0 })
  attempts: number;
}

export const PasswordResetChallengeSchema = SchemaFactory.createForClass(
  PasswordResetChallenge,
);

PasswordResetChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
