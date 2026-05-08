import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RegisterHeader } from './RegisterHeader';

type LayoutMode = 'fullScroll' | 'headerThenFill';

type Props = {
  currentStep: 1 | 2 | 3;
  description: string;
  children: ReactNode;
  /** OTP-style: header fixed, body vertically centered in remaining space */
  layout?: LayoutMode;
};

export function RegisterScreenShell({
  currentStep,
  description,
  children,
  layout = 'fullScroll',
}: Props) {
  const insets = useSafeAreaInsets();

  const header = (
    <RegisterHeader currentStep={currentStep} description={description} />
  );

  const bottomPad = Math.max(insets.bottom, 12);

  // LinearGradient is not a NativeWind interop target — `className` flex does not apply.
  // Without flex:1 the stack route collapses to zero height (blank screen).
  const fill = { flex: 1 as const };

  if (layout === 'headerThenFill') {
    return (
      <LinearGradient
        colors={['#EEF0F4', '#FFFFFF']}
        locations={[0, 0.5]}
        style={fill}
      >
        <StatusBar style="dark" />
        <KeyboardAvoidingView
          style={fill}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={fill}>
            {header}
            <View
              className="flex-1 justify-center px-screen-x"
              style={{ paddingBottom: bottomPad }}
            >
              {children}
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#EEF0F4', '#FFFFFF']}
      locations={[0, 0.5]}
      style={fill}
    >
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={fill}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottomPad }}
        >
          {header}
          <View className="mt-5 px-screen-x flex-col">{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
