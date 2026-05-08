import { useMutation, useQueryClient } from '@tanstack/react-query';

import { login } from '@/services/auth/authService';
import { authKeys } from '@/shared/state/authKeys';
import { setAccessToken } from '@/services/storage/secureStore';

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: async (session) => {
      await setAccessToken(session.accessToken);
      await queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
  });
}
