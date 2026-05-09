import { Redirect, Stack } from "expo-router";

import { useAuthSession } from "../../hooks/auth/useAuthSession";

export default function AppShellLayout() {
  const { data, isPending } = useAuthSession();

  if (!isPending && !data?.isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="booking" />
    </Stack>
  );
}
