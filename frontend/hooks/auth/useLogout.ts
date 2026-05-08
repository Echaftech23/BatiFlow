import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authKeys } from '@/shared/state/authKeys';
import { queryClient as appQueryClient } from '@/services/query/queryClient';
import { clearAccessToken } from '@/services/storage/secureStore';

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await clearAccessToken();
    },
    onSuccess: async () => {
      appQueryClient.clear();
      await queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
  });
}
