import { router } from "expo-router";
import {
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  MessageSquare,
  User,
} from "lucide-react-native";
import type { ReactNode } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DarkBrandLogo } from "@/components/logo/dark";
import { clearAccessToken } from "@/services/storage/secureStore";
import { queryClient } from "@/services/query/queryClient";

// ─── Sub-components ──────────────────────────────────────────────────────────

type RowProps = {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
  badge?: string;
  isLast?: boolean;
};

function SettingRow({ icon, label, onPress, badge, isLast }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center px-4 py-[15px] ${isLast ? "" : "border-b border-border"}`}
      android_ripple={{ color: "rgba(26,43,72,0.05)" }}
    >
      <View className="h-8 w-8 items-center justify-center rounded-lg bg-muted">
        {icon}
      </View>
      <Text className="ml-3 flex-1 font-sans text-body text-navy">{label}</Text>
      {badge ? (
        <View className="mr-2 rounded-full bg-primary px-2 py-0.5">
          <Text className="font-sans text-[11px] text-white">{badge}</Text>
        </View>
      ) : null}
      <ChevronRight size={16} color="#9CA3AF" strokeWidth={2} />
    </Pressable>
  );
}

type SectionProps = { title: string; children: ReactNode };

function SettingSection({ title, children }: SectionProps) {
  return (
    <View className="mt-6 px-screen-x">
      <Text className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </Text>
      <View
        className="overflow-hidden rounded-card bg-surface"
        style={shadows.card}
      >
        {children}
      </View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function ParametresScreen() {
  const insets = useSafeAreaInsets();

  const onLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir quitter la session ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: () => {
            void (async () => {
              await clearAccessToken();
              queryClient.clear();
              router.replace("/(auth)/login");
            })();
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="bg-surface px-screen-x pb-3"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between">
          <DarkBrandLogo width={40} height={36} />
          <Pressable disabled accessibilityLabel="Notifications" hitSlop={24}>
            <Bell size={22} color="#1A2B48" strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-12"
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <View className="mt-8 px-screen-x">
          <Text className="font-quicksand font-bold text-title text-navy">
            Paramètres
          </Text>
          <Text className="mt-1 font-sans text-body text-muted-foreground">
            Gérez votre compte et vos préférences.
          </Text>
        </View>

        {/* Profile card */}
        <View className="mt-6 px-screen-x">
          <View
            className="flex-row items-center rounded-card bg-surface px-4 py-4"
            style={shadows.card}
          >
            <View className="h-14 w-14 items-center justify-center rounded-full bg-navy">
              <Text className="font-sans-bold text-[20px] text-white">B</Text>
            </View>
            <View className="ml-4 flex-1">
              <Text className="font-sans-semibold text-body text-navy">
                Mon profil
              </Text>
              <Text className="mt-0.5 font-sans text-[13px] text-muted-foreground">
                Artisan · BatiFlow
              </Text>
            </View>
            <View className="rounded-full bg-primary/10 px-3 py-1">
              <Text className="font-sans-medium text-[12px] text-primary">
                Pro
              </Text>
            </View>
          </View>
        </View>

        {/* Mon compte */}
        <SettingSection title="Mon compte">
          <SettingRow
            icon={<User size={17} color="#1A2B48" strokeWidth={2} />}
            label="Informations personnelles"
          />
          <SettingRow
            icon={<Lock size={17} color="#1A2B48" strokeWidth={2} />}
            label="Changer le mot de passe"
            onPress={() => router.push("/(auth)/forgot-password")}
            isLast
          />
        </SettingSection>

        {/* Préférences */}
        <SettingSection title="Préférences">
          <SettingRow
            icon={<Bell size={17} color="#1A2B48" strokeWidth={2} />}
            label="Notifications"
            badge="Bientôt"
          />
          <SettingRow
            icon={<Globe size={17} color="#1A2B48" strokeWidth={2} />}
            label="Langue"
            badge="FR"
            isLast
          />
        </SettingSection>

        {/* Support */}
        <SettingSection title="Support">
          <SettingRow
            icon={<HelpCircle size={17} color="#1A2B48" strokeWidth={2} />}
            label="Centre d'aide"
          />
          <SettingRow
            icon={<MessageSquare size={17} color="#1A2B48" strokeWidth={2} />}
            label="Nous contacter"
            isLast
          />
        </SettingSection>

        {/* Session */}
        <View className="mt-6 px-screen-x">
          <View
            className="overflow-hidden rounded-card bg-surface"
            style={shadows.card}
          >
            <Pressable
              onPress={onLogout}
              className="flex-row items-center px-4 py-[15px]"
              android_ripple={{ color: "rgba(239,68,68,0.08)" }}
            >
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                <LogOut size={17} color="#EF4444" strokeWidth={2} />
              </View>
              <Text className="ml-3 flex-1 font-sans-medium text-body text-destructive">
                Se déconnecter
              </Text>
            </Pressable>
          </View>
        </View>

        {/* App version */}
        <Text className="mt-8 text-center font-sans text-[12px] text-muted-foreground">
          BatiFlow · v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const shadows = StyleSheet.create({
  card: {
    shadowColor: "#1A2B48",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});
