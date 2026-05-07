import { Redirect, Stack } from 'expo-router';

import { GlobalLoader } from '../../components/ui/GlobalLoader';
import { useAuthSession } from '../../hooks/auth/useAuthSession';

export default function AppShellLayout() {
  const { data, isPending } = useAuthSession();
  if (isPending) return <GlobalLoader label="Session..." />;
  if (!data?.isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="booking"
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack>
  );
}
