import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import lockImage from "@/assets/icons/security.png";
import { PrimaryButton } from "@/components/ui";
import { RegisterScreenShell } from "@/components/auth/register/RegisterScreenShell";

const CTA_SHADOW = {
  shadowColor: "#F27427",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.3,
  shadowRadius: 12,
  elevation: 9,
} as const;

export default function RegisterCguScreen() {
  const [accepted, setAccepted] = useState(false);

  return (
    <RegisterScreenShell
      currentStep={3}
      description="Dernière étape : acceptez les conditions pour accéder à la plateforme."
    >
      <View className="mt-5 rounded-[24px] border border-[#D1D5DB] bg-white px-5 pb-7 pt-8">
        <View className="items-center">
          <View className="h-20 w-20 items-center justify-center rounded-2xl bg-[#FCE9DB]">
            <Image
              source={lockImage}
              className="h-8 w-8"
              resizeMode="contain"
            />
          </View>
          <Text className="mt-5 text-center font-quicksand text-[20px] font-bold leading-none text-[#525252]">
            Conditions d&apos;utilisation
          </Text>
          <Text className="mt-4 px-6 text-center text-[14px] font-normal leading-[20px] text-[#52525B]">
            merci de consulter nos engagements avant l&apos;inscription.
          </Text>
        </View>

        <View className="mt-6 h-px bg-[#E5E7EB]" />

        <View className="mt-6 flex-row items-center">
          <View className="h-7 w-7 items-center justify-center rounded-md bg-[#E5E7EB]">
            <Text className="text-[12px] font-sans-semibold text-[#525252]">
              1
            </Text>
          </View>
          <Text className="ml-3 text-[16px] font-sans-semibold text-[#525252]">
            Objet du Service
          </Text>
        </View>

        <Text className="mt-4 pb-14 text-body font-light leading-[20px] tracking-[0px] text-[#737373]">
          Le présent document définit conditions dans lesquelles
          l&apos;entreprise Atelier fournit ses services aux artisans. En
          utilisant notre plateforme, vous acceptez de respecter ces termes sans
          réserve. se réserve le droit de modifier ces termes à tout moment pour
          s&apos;adapter aux évolutions législatives.
        </Text>
      </View>

      <Pressable
        onPress={() => setAccepted((v) => !v)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: accepted }}
        className="mt-5 flex-row items-start"
      >
        <View
          className={
            accepted
              ? "h-5 w-5 items-center justify-center rounded-[4px] border border-primary bg-primary"
              : "h-5 w-5 items-center justify-center rounded-[4px] border border-[#A1A1AA] bg-white"
          }
        >
          {accepted ? (
            <Check size={14} color="#FFFFFF" strokeWidth={3} />
          ) : null}
        </View>
        <Text className="ml-3 flex-1 text-[12px] font-normal leading-[18px] text-[#52525B]">
          J&apos;accepte les Conditions Générales et la politique de
          Confidentialité .
        </Text>
      </Pressable>

      <PrimaryButton
        title="Continuer"
        disabled={!accepted}
        onPress={() => router.replace("/(app)/welcome")}
        className="mb-10 mt-12 rounded-pill bg-primary py-4 disabled:opacity-60"
        textClassName="text-center font-semibold text-body leading-[32px] text-white"
        style={CTA_SHADOW}
      />
    </RegisterScreenShell>
  );
}
