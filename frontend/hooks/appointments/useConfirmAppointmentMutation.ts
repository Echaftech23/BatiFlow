import { useMutation, useQueryClient } from '@tanstack/react-query';

import { confirmAppointment } from '@/services/appointments/appointmentsService';
import { appointmentsKeys } from '@/shared/state/appointmentsKeys';
import type { Appointment } from '@/shared/schemas/appointmentsSchemas';

export function useConfirmAppointmentMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await confirmAppointment(id);
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: appointmentsKeys.all });
      const previous = qc.getQueryData<Appointment[]>(appointmentsKeys.all);
      qc.setQueryData<Appointment[]>(appointmentsKeys.all, (old) =>
        (old ?? []).map((a) => (a.id === id ? { ...a, status: 'CONFIRME' as const } : a)),
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(appointmentsKeys.all, ctx.previous);
      }
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: appointmentsKeys.all });
    },
  });
}
