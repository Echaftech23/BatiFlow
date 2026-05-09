import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class UserProfile {
  @Prop()
  name?: string;

  @Prop()
  profession?: string;

  @Prop()
  phone?: string;

  @Prop()
  zone?: string;

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop()
  zip?: string;
}

const UserProfileSchema = SchemaFactory.createForClass(UserProfile);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ select: false })
  passwordHash?: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ type: UserProfileSchema })
  profile?: UserProfile;

  @Prop({ sparse: true, unique: true, trim: true })
  firebaseUid?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
