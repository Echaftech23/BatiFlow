import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  Appointment,
  AppointmentDocument,
  AppointmentStatus,
} from './schemas/appointment.schema';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

  async listForOwner(ownerId: string) {
    return this.appointmentModel
      .find({ ownerId: new Types.ObjectId(ownerId) })
      .sort({ startsAt: -1 })
      .lean()
      .exec();
  }

  async findOne(ownerId: string, appointmentId: string) {
    const appointment = await this.findOwnedOrThrow(ownerId, appointmentId);
    return appointment.toObject();
  }

  async create(ownerId: string, dto: CreateAppointmentDto) {
    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(dto.endsAt);
    if (endsAt <= startsAt) {
      throw new BadRequestException('endsAt must be after startsAt');
    }

    const created = await this.appointmentModel.create({
      ownerId: new Types.ObjectId(ownerId),
      client: dto.client,
      serviceLabel: dto.serviceLabel,
      startsAt,
      endsAt,
      status: AppointmentStatus.EN_ATTENTE,
      notes: dto.notes,
    });
    return created.toObject();
  }

  async update(
    ownerId: string,
    appointmentId: string,
    dto: UpdateAppointmentDto,
  ) {
    const appointment = await this.findOwnedOrThrow(ownerId, appointmentId);

    const nextStarts =
      dto.startsAt !== undefined
        ? new Date(dto.startsAt)
        : appointment.startsAt;
    const nextEnds =
      dto.endsAt !== undefined ? new Date(dto.endsAt) : appointment.endsAt;

    if (nextEnds <= nextStarts) {
      throw new BadRequestException('endsAt must be after startsAt');
    }

    if (dto.startsAt !== undefined) {
      appointment.startsAt = nextStarts;
    }
    if (dto.endsAt !== undefined) {
      appointment.endsAt = nextEnds;
    }
    if (dto.serviceLabel !== undefined) {
      appointment.serviceLabel = dto.serviceLabel;
    }
    if (dto.notes !== undefined) {
      appointment.notes = dto.notes;
    }
    if (dto.client) {
      const c = dto.client;
      if (c.name !== undefined) {
        appointment.client.name = c.name;
      }
      if (c.phone !== undefined) {
        appointment.client.phone = c.phone;
      }
      if (c.email !== undefined) {
        appointment.client.email = c.email;
      }
      if (c.address !== undefined) {
        appointment.client.address = c.address;
      }
      if (c.city !== undefined) {
        appointment.client.city = c.city;
      }
      if (c.zip !== undefined) {
        appointment.client.zip = c.zip;
      }
    }

    await appointment.save();
    return appointment.toObject();
  }

  async remove(ownerId: string, appointmentId: string) {
    const appointment = await this.findOwnedOrThrow(ownerId, appointmentId);
    await appointment.deleteOne();
    return { deleted: true };
  }

  async confirm(ownerId: string, appointmentId: string) {
    const appointment = await this.findOwnedOrThrow(ownerId, appointmentId);

    if (appointment.status !== AppointmentStatus.EN_ATTENTE) {
      throw new BadRequestException(
        'Only pending appointments can be confirmed',
      );
    }

    appointment.status = AppointmentStatus.CONFIRME;
    await appointment.save();
    return appointment.toObject();
  }

  async getBookedSlots(ownerId: string, date: string): Promise<string[]> {
    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59.999`);

    const appointments = await this.appointmentModel
      .find({
        ownerId: new Types.ObjectId(ownerId),
        startsAt: { $gte: dayStart, $lte: dayEnd },
      })
      .select('startsAt')
      .lean()
      .exec();

    return appointments.map((a) => {
      const d = new Date(a.startsAt);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    });
  }

  private async findOwnedOrThrow(
    ownerId: string,
    appointmentId: string,
  ): Promise<AppointmentDocument> {
    if (!Types.ObjectId.isValid(appointmentId)) {
      throw new BadRequestException('Invalid appointment id');
    }

    const appointment = await this.appointmentModel
      .findById(appointmentId)
      .exec();
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.ownerId.toString() !== ownerId) {
      throw new ForbiddenException('Not allowed to access this appointment');
    }

    return appointment;
  }
}
