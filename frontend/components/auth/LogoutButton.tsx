import { router } from 'expo-router';
import { Alert, Pressable, Text } from 'react-native';

import { useLogout } from '@/hooks/auth/useLogout';

export function LogoutButton() {
  const logout = useLogout();

  return (
    <Pressable
      onPress={() =>
        Alert.alert('Deconnexion', 'Quitter la session ?', [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Deconnexion',
            style: 'destructive',
            onPress: () => {
              logout.mutate(undefined, {
                onSuccess: () => router.replace('/(auth)/login'),
              });
            },
          },
        ])
      }
      className="mt-6 rounded-button border border-destructive py-4"
    >
      <Text className="text-center font-sans-semibold text-body text-destructive">Se deconnecter</Text>
    </Pressable>
  );
}
