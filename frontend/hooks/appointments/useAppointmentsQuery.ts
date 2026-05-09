import { useQuery } from '@tanstack/react-query';

import { getAppointments } from '@/services/appointments/appointmentsService';
import { mapAppointmentDoc } from '@/shared/mappers/mapAppointment';
import { appointmentsKeys } from '@/shared/state/appointmentsKeys';

export function useAppointmentsQuery() {
  return useQuery({
    queryKey: appointmentsKeys.all,
    queryFn: async () => {
      const rows = await getAppointments();
      return rows.map(mapAppointmentDoc);
    },
  });
}
