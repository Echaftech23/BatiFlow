import { View } from "react-native";

import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import { ForgotPasswordEnterEmail } from "@/components/auth/forgot-password";

export default function ForgotPasswordScreen() {
  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <ForgotPasswordEnterEmail onBack={() => router.back()} />
    </View>
  );
}
