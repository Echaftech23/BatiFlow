import { z } from 'zod';

const appointmentStatusSchema = z.union([z.literal('EN_ATTENTE'), z.literal('CONFIRME')]);

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;

export const appointmentApiDocSchema = z.object({
  _id: z.string(),
  client: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
  }),
  serviceLabel: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  status: appointmentStatusSchema,
  notes: z.string().optional(),
});

export const createAppointmentSchema = z.object({
  client: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional(),
  }),
  serviceLabel: z.string().min(1),
  startsAt: z.string(),
  endsAt: z.string(),
  notes: z.string().optional(),
});

export type AppointmentApiDoc = z.infer<typeof appointmentApiDocSchema>;

export const appointmentSchema = z.object({
  id: z.string(),
  clientName: z.string(),
  serviceLabel: z.string(),
  /** YYYY-MM-DD */
  dateKey: z.string(),
  timeLabel: z.string(),
  /** e.g. 1h30 */
  durationLabel: z.string(),
  phone: z.string(),
  status: appointmentStatusSchema,
  addressLine: z.string().optional(),
  notes: z.string().optional(),
});

export type Appointment = z.infer<typeof appointmentSchema>;

export function appointmentsToMarkedDates(
  items: Appointment[],
): Record<string, { marked: boolean; dotColor: string }> {
  const map: Record<string, { marked: boolean; dotColor: string }> = {};
  for (const a of items) {
    map[a.dateKey] = { marked: true, dotColor: '#F27427' };
  }
  return map;
}
