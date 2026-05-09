<<<<<<< Updated upstream
import { z } from 'zod';

const appointmentStatusSchema = z.union([z.literal('EN_ATTENTE'), z.literal('CONFIRME')]);
=======
import { z } from "zod";
import { emailField, phoneField, zipField } from "./fieldSchemas";

const appointmentStatusSchema = z.union([
  z.literal("EN_ATTENTE"),
  z.literal("CONFIRME"),
]);
>>>>>>> Stashed changes

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;

export const appointmentApiDocSchema = z.object({
  _id: z.string(),
  client: z.object({
<<<<<<< Updated upstream
    name: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
=======
    name: z.string().nonempty("Nom requis").min(3, "Nom minimum 3 caractères"),
    phone: phoneField,
    email: emailField,
    address: z.string().nonempty("Adresse requise").min(3, "Adresse minimum 3 caractères"),
    zip: zipField,
    city: z.string().nonempty("Ville requise").min(3, "Ville minimum 3 caractères"),
>>>>>>> Stashed changes
  }),
  serviceLabel: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  status: appointmentStatusSchema,
  notes: z.string().optional(),
});

export const createAppointmentSchema = z.object({
  client: z.object({
<<<<<<< Updated upstream
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional(),
  }),
  serviceLabel: z.string().min(1),
=======
    name: z.string().nonempty("Nom requis").min(3, "Nom minimum 3 caractères"),
    phone: phoneField,
    email: emailField,
    address: z.string().nonempty("Adresse requise").min(3, "Adresse minimum 3 caractères"),
    zip: zipField,
    city: z.string().nonempty("Ville requise").min(3, "Ville minimum 3 caractères"),
  }),
  serviceLabel: z.string().nonempty("Motif requis").min(3, "Motif minimum 3 caractères"),
>>>>>>> Stashed changes
  startsAt: z.string(),
  endsAt: z.string(),
  notes: z.string().optional(),
});

export type AppointmentApiDoc = z.infer<typeof appointmentApiDocSchema>;

export const appointmentSchema = z.object({
  id: z.string(),
  clientName: z.string(),
<<<<<<< Updated upstream
  serviceLabel: z.string(),
=======
>>>>>>> Stashed changes
  /** YYYY-MM-DD */
  dateKey: z.string(),
  timeLabel: z.string(),
  /** e.g. 1h30 */
  durationLabel: z.string(),
<<<<<<< Updated upstream
=======
  serviceLabel: z.string(),
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    map[a.dateKey] = { marked: true, dotColor: '#F27427' };
  }
  return map;
}
=======
    map[a.dateKey] = { marked: true, dotColor: "#F27427" };
  }
  return map;
}

/** All bookable time slots in HH:mm format (must match the slot screen). */
export const ALL_SLOTS = [
  "09:00", "09:30",
  "10:00", "10:30",
  "12:00", "12:30",
  "14:00", "14:30",
  "16:00", "17:30",
] as const;

/**
 * Returns a set of YYYY-MM-DD date strings where every time slot is already
 * occupied in the given appointments list.
 */
export function computeFullyBookedDates(items: Appointment[]): Set<string> {
  const slotsByDate = new Map<string, Set<string>>();
  for (const a of items) {
    if (!slotsByDate.has(a.dateKey)) {
      slotsByDate.set(a.dateKey, new Set());
    }
    slotsByDate.get(a.dateKey)!.add(a.timeLabel.slice(0, 5));
  }
  const fullyBooked = new Set<string>();
  for (const [date, booked] of slotsByDate) {
    if (ALL_SLOTS.every((s) => booked.has(s))) {
      fullyBooked.add(date);
    }
  }
  return fullyBooked;
}
>>>>>>> Stashed changes
