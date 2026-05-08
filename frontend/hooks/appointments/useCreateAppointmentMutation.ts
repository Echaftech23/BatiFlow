import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createAppointment } from '@/services/appointments/appointmentsService';
import { appointmentsKeys } from '@/shared/state/appointmentsKeys';

export function useCreateAppointmentMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: appointmentsKeys.all });
    },
  });
}
