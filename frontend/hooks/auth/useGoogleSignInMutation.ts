import { useMutation, useQueryClient } from '@tanstack/react-query';

import { signInWithGoogle } from '@/services/auth/googleSignIn';
import { authKeys } from '@/shared/state/authKeys';
import { setAccessToken } from '@/services/storage/secureStore';

export function useGoogleSignInMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const credential = await signInWithGoogle();
      const idToken = await credential.user.getIdToken();
      return idToken;
    },
    onSuccess: async (idToken) => {
      await setAccessToken(idToken);
      await queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
  });
}
