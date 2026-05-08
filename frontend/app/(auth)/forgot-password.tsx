import { useState } from 'react';
import { View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

import {
  ForgotPasswordEmailSent,
  ForgotPasswordEnterEmail,
} from '@/components/forgot-password';

type Step = 'email' | 'sent';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>('email');

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      {step === 'email' ? (
        <ForgotPasswordEnterEmail
          onBack={() => router.back()}
          onLinkSent={() => setStep('sent')}
        />
      ) : (
        <ForgotPasswordEmailSent
          onBackToLogin={() => router.replace('/(auth)/login')}
        />
      )}
    </View>
  );
}
