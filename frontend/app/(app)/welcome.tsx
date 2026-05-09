import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import noteImage from "@/assets/icons/note.png";
import userImage from "@/assets/icons/user.png";
import messageImage from "@/assets/icons/message.png";

import { DarkBrandLogo } from "../../components/logo/dark";

const CTA_SHADOW = {
  shadowColor: "#F27427",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.28,
  shadowRadius: 14,
  elevation: 10,
} as const;

const SETUP_ITEMS = [
  {
    id: "sms",
    title: "Configuration SMS",
    description: "Activez les réponses automatiques",
    Icon: messageImage,
  },
  {
    id: "profil",
    title: "Profil Professionnel",
    description: "Personnalisez votre carte de visite",
    Icon: userImage,
  },
  {
    id: "formulaire",
    title: "Formulaire",
    description: "Personnalisez votre formulaire",
    Icon: noteImage,
  },
] as const;

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#F4F5F7]">
      <Image
        source={require("../../assets/images/banner.png")}
        accessibilityIgnoresInvertColors
        className="absolute"
        style={{
          top: -108,
          left: -51,
          width: 463,
          height: 463,
          opacity: 1,
          transform: [{ rotate: "-6.02deg" }],
        }}
      />

      <ScrollView
        className="relative z-20 flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 48,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-screen-x">
          <View className="items-center">
            <DarkBrandLogo width={40} height={35} />
          </View>
          <Text className="mt-6 text-center font-sans-bold text-[20px] text-[#1A2B48]">
            Bienvenue, Thomas !
          </Text>
          <Text className="mt-2 px-3 text-center font-normal text-body leading-normal text-[#3F3F46]">
            Votre espace de travail est prêt. Transformez chaque appel en
            opportunité dès aujourd&apos;hui.
          </Text>
        </View>

        <View className="mx-screen-x mt-10 rounded-[24px] border border-[#D4D4D8] bg-[#F8F9FB] px-6 pb-8 pt-9">
          <View className="self-start rounded-[6px] bg-[#E4E4E7] px-4 py-[10px]">
            <Text className="font-semibold text-caption leading-[14.83px] tracking-[0.99px] uppercase text-[#3F3F46]">
              Configuration
            </Text>
          </View>

          <Text className="mt-7 font-bold text-[20px] leading-[30px] text-[#3F3F46]">
            Guide de démarrage rapide
          </Text>

          <View className="mt-7 gap-3">
            {SETUP_ITEMS.map(({ id, title, description, Icon }) => (
              <Pressable
                key={id}
                className="flex-row items-center rounded-[16px] bg-[#EEF0F4] px-5 py-5"
              >
                <View className="h-12 w-12 items-center justify-center rounded-[12px] border border-[#D4D4D8] bg-[#F9FAFB]">
                  <Image
                    source={Icon}
                    className="w-6 h-6"
                    resizeMode="contain"
                  />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="font-sans-semibold text-[16px] leading-[22px] text-[#3F3F46]">
                    {title}
                  </Text>
                  <Text className="mt-1 font-normal text-badge leading-normal text-[#52525B]">
                    {description}
                  </Text>
                </View>
                <ChevronRight size={28} color="#737373" />
              </Pressable>
            ))}
          </View>

          <Pressable
            className="mt-7 items-center rounded-pill bg-primary py-5"
            style={CTA_SHADOW}
            onPress={() => router.replace("/(app)/(tabs)/rendez-vous")}
          >
            <Text className="font-semibold text-body text-white">
              Accéder au tableau de bord
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
