import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="date" />
      <Stack.Screen name="slot" />
      <Stack.Screen name="client" />
    </Stack>
  );
}
