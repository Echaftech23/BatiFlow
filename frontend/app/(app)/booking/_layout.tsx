import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: '#1A2B48',
        headerTitleStyle: { fontFamily: 'Poppins_600SemiBold' },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#F8F9FB' },
      }}
    >
      <Stack.Screen name="date" options={{ title: 'Date' }} />
      <Stack.Screen name="slot" options={{ title: 'Créneau' }} />
      <Stack.Screen name="client" options={{ title: 'Informations client' }} />
    </Stack>
  );
}
