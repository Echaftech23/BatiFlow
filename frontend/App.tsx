import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!loaded) {
    return null;
  }

  return (
    <View className="flex-1 items-center justify-center bg-background px-screen-x">
      <Text className="font-sans-bold text-title text-navy">BatiFlow</Text>
      <Text className="font-sans mt-2 text-body text-muted-foreground">
        NativeWind + Inter
      </Text>
      <View className="mt-section-y rounded-card bg-surface p-4 shadow-card">
        <Text className="font-sans-semibold text-subtitle text-navy">
          Design tokens
        </Text>
        <Text className="font-sans mt-1 text-caption text-muted-foreground">
          Primary, navy, radii, shadows, and typography are centralized in
          tailwind.config.js.
        </Text>
      </View>
      <StatusBar style="dark" />
    </View>
  );
}
