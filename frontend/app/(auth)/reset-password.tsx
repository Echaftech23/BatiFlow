import { Pressable, Text, View } from "react-native";

import { Link, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ForgotPasswordReset } from "@/components/auth/forgot-password";
import { getPendingPasswordReset } from "@/lib/forgotPasswordSession";

function normalizeEmailParam(
  raw: string | string[] | undefined,
): string | null {
  if (typeof raw === "string" && raw.trim().length > 0) {
    return raw.trim().toLowerCase();
  }
  if (Array.isArray(raw) && typeof raw[0] === "string" && raw[0].trim()) {
    return raw[0].trim().toLowerCase();
  }
  return null;
}

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string | string[] }>();
  const email = normalizeEmailParam(params.email);

  const session = email ? getPendingPasswordReset(email) : null;
  const ok = !!(email && session?.code);

  if (!ok) {
    return (
      <View className="flex-1 justify-center bg-background px-screen-x">
        <StatusBar style="dark" />
        <Text className="text-center font-sans-bold text-title text-navy">
          Étapes manquantes
        </Text>
        <Text className="mt-3 text-center text-body text-muted-foreground">
          Validez d&apos;abord le code envoyé par e-mail depuis l&apos;écran
          « Mot de passe oublié ».
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
        email={email!}
        code={session!.code}
        onBack={() => router.replace("/(auth)/forgot-password")}
        onConfirmSuccess={() => router.replace("/(auth)/login")}
      />
    </View>
  );
}
