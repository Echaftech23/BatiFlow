import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Link, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ForgotPasswordReset } from '@/components/forgot-password';

function normalizeToken(raw: string | string[] | undefined): string {
  if (typeof raw === 'string') {
    return decodeURIComponent(raw.trim());
  }
  if (Array.isArray(raw) && raw[0]) {
    return decodeURIComponent(String(raw[0]).trim());
  }
  return '';
}

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ token?: string | string[] }>();
  const token = useMemo(
    () => normalizeToken(params.token),
    [params.token],
  );

  const tokenOk = token.length >= 40;

  if (!tokenOk) {
    return (
      <View className="flex-1 justify-center bg-background px-screen-x">
        <StatusBar style="dark" />
        <Text className="text-center font-sans-bold text-title text-navy">
          Lien invalide
        </Text>
        <Text className="mt-3 text-center text-body text-muted-foreground">
          Ce lien de réinitialisation est incomplet ou a expiré. Demandez un
          nouveau lien depuis l’écran « Mot de passe oublié ».
        </Text>
        <Link href="/(auth)/forgot-password" asChild>
          <Pressable className="mt-8 rounded-pill bg-primary py-4">
            <Text className="text-center font-sans-semibold text-body text-on-primary">
              Mot de passe oublié
            </Text>
          </Pressable>
        </Link>
        <Link href="/(auth)/login" asChild>
          <Pressable className="mt-4 py-3">
            <Text className="text-center text-caption text-primary">
              Retour à la connexion
            </Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <ForgotPasswordReset
        resetToken={token}
        onBack={() => router.replace('/(auth)/login')}
        onConfirmSuccess={() => router.replace('/(auth)/login')}
      />
    </View>
  );
}
