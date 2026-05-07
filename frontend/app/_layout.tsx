import 'react-native-gesture-handler';
import '../global.css';

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Quicksand_700Bold } from '@expo-google-fonts/quicksand';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AppProviders } from '../providers/AppProviders';

export default function RootLayout() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Quicksand_700Bold,
  });

  if (!loaded) {
    return null;
  }

  return (
    <AppProviders>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="dark" />
    </AppProviders>
  );
}
