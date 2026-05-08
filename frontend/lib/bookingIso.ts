/** Builds ISO datetimes for the API from a calendar date (YYYY-MM-DD) and HH:mm slot. */
export function slotToStartsEndsIso(
  dateKey: string,
  slotHHmm: string,
  durationMinutes = 30,
): { startsAt: string; endsAt: string } {
  const startsAt = new Date(`${dateKey}T${slotHHmm}:00`);
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60 * 1000);
  return { startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString() };
}
