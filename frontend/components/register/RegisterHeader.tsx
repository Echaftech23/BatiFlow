import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RegisterBrandLogo } from './RegisterBrandLogo';
import { RegisterStepper } from './RegisterStepper';

const BACK_SHADOW = {
  shadowColor: '#1A2B48',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 3,
} as const;

type Props = {
  currentStep: 1 | 2 | 3;
  description: string;
};

export function RegisterHeader({ currentStep, description }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View className="px-screen-x" style={{ paddingTop: insets.top + 8 }}>
      <View className="relative min-h-[52px] justify-center">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          className="absolute left-0 top-0 z-10 h-10 w-10 items-center justify-center rounded-full bg-surface"
          style={BACK_SHADOW}
        >
          <ChevronLeft size={22} color="#6B7280" />
        </Pressable>
        <View className="items-center pt-0.5">
          <RegisterBrandLogo width={44} />
          <Text className="mx-4 mt-4 text-center text-body leading-6 text-navy">
            {description}
          </Text>
        </View>
      </View>
      <RegisterStepper currentStep={currentStep} />
    </View>
  );
}
