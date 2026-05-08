import { router } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { clearAccessToken } from '@/services/storage/secureStore';
import { queryClient } from '@/services/query/queryClient';

export default function ParametresScreen() {
  const insets = useSafeAreaInsets();

  const onLogout = () => {
    Alert.alert('Déconnexion', 'Quitter la session ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            await clearAccessToken();
            queryClient.clear();
            router.replace('/(auth)/login');
          })();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center justify-between bg-surface px-screen-x pb-4 shadow-segmented"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text className="font-sans-bold text-title text-navy">Paramètres</Text>
        <View className="rounded-full bg-muted p-2">
          <Bell size={22} color="#1A2B48" />
        </View>
      </View>
      <View className="px-screen-x py-section-y">
        <View className="rounded-card border border-border bg-surface p-5 shadow-card">
          <Text className="font-sans-semibold text-subtitle text-navy">Compte</Text>
          <Text className="font-sans mt-2 text-caption text-muted-foreground">
            Profil, notifications et préférences — à brancher sur GET /users/me.
          </Text>
          <Pressable
            onPress={onLogout}
            className="mt-6 rounded-button border border-destructive py-4"
          >
            <Text className="text-center font-sans-semibold text-body text-destructive">
              Se déconnecter
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
