import { useQuery } from '@tanstack/react-query';

import { authKeys } from '@/shared/state/authKeys';
import { getAccessToken } from '@/services/storage/secureStore';

export function useAuthSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: async () => {
      const token = await getAccessToken();
      return { isAuthenticated: Boolean(token), token };
    },
    staleTime: 5_000,
  });
}
