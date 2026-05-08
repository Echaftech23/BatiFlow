import axiosInstance from '@/api/axios.config';
import {
  appointmentApiDocSchema,
  createAppointmentSchema,
  type AppointmentApiDoc,
} from '@/shared/schemas/appointmentsSchemas';

export async function getAppointments(): Promise<AppointmentApiDoc[]> {
  const { data } = await axiosInstance.get('/appointments');
  return appointmentApiDocSchema.array().parse(data);
}

export async function confirmAppointment(id: string): Promise<AppointmentApiDoc> {
  const { data } = await axiosInstance.patch(`/appointments/${id}/confirm`);
  return appointmentApiDocSchema.parse(data);
}

export async function createAppointment(input: unknown): Promise<AppointmentApiDoc> {
  const payload = createAppointmentSchema.parse(input);
  const { data } = await axiosInstance.post('/appointments', payload);
  return appointmentApiDocSchema.parse(data);
}
