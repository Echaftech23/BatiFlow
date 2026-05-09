import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum AppointmentStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  CONFIRME = 'CONFIRME',
}

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema({ _id: false })
export class AppointmentClient {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ trim: true })
  city?: string;

  @Prop({ trim: true })
  zip?: string;
}

const AppointmentClientSchema = SchemaFactory.createForClass(AppointmentClient);

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: AppointmentClientSchema, required: true })
  client: AppointmentClient;

  @Prop({ required: true, trim: true })
  serviceLabel: string;

  @Prop({ required: true })
  startsAt: Date;

  @Prop({ required: true })
  endsAt: Date;

  @Prop({
    enum: AppointmentStatus,
    default: AppointmentStatus.EN_ATTENTE,
  })
  status: AppointmentStatus;

  @Prop({ trim: true })
  notes?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

AppointmentSchema.index({ ownerId: 1, startsAt: -1 });
