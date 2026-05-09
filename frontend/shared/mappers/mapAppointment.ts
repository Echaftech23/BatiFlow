import type { Appointment, AppointmentApiDoc } from '@/shared/schemas/appointmentsSchemas';

function buildAddressLine(client: AppointmentApiDoc['client']): string | undefined {
  const street = client.address?.trim();
  const cityLine = [client.zip?.trim(), client.city?.trim()].filter(Boolean).join(' ');
  const parts = [street, cityLine].filter((p): p is string => Boolean(p?.length));
  return parts.length ? parts.join(', ') : undefined;
}

function formatDurationFr(start: Date, end: Date): string {
  const totalMin = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  if (totalMin <= 0) return '—';
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0 && m > 0) return `${h}h${String(m).padStart(2, '0')}`;
  if (h > 0) return `${h}h`;
  return `${totalMin} min`;
}

export function mapAppointmentDoc(doc: AppointmentApiDoc): Appointment {
  const start = new Date(doc.startsAt);
  const end = new Date(doc.endsAt);
  const y = start.getFullYear();
  const m = String(start.getMonth() + 1).padStart(2, '0');
  const d = String(start.getDate()).padStart(2, '0');
  const dateKey = `${y}-${m}-${d}`;
  const timeLabel = start.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return {
    id: String(doc._id),
    clientName: doc.client.name,
    serviceLabel: doc.serviceLabel,
    dateKey,
    timeLabel,
    durationLabel: formatDurationFr(start, end),
    phone: doc.client.phone,
    status: doc.status,
    addressLine: buildAddressLine(doc.client),
    notes: doc.notes,
  };
}
