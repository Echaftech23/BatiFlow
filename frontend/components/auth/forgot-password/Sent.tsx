import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ForgotPasswordAuthShell } from "./AuthShell";

type Props = {
  onBackToLogin: () => void;
};

export function ForgotPasswordEmailSent({ onBackToLogin }: Props) {
  return (
    <ForgotPasswordAuthShell
      headerTypography="paragraph"
      headerLines={[
        "Consultez votre boîte e-mail.",
        "Nous vous avons envoyé un lien pour réinitialiser votre mot de passe (valable 1 heure).",
      ]}
      onBack={onBackToLogin}
    >
      <View className="flex-1 justify-between px-screen-x pb-10 pt-4">
        <Text className="text-badge leading-6 text-muted-foreground">
          Ouvrez le lien sur votre téléphone : il relancera l’application BatiFlow sur
          l’écran de nouveau mot de passe.
        </Text>
        <Link href="/(auth)/login" asChild>
          <Pressable className="rounded-pill bg-primary py-4">
            <Text className="text-center font-sans-semibold text-body text-on-primary">
              Retour à la connexion
            </Text>
          </Pressable>
        </Link>
      </View>
    </ForgotPasswordAuthShell>
  );
}
