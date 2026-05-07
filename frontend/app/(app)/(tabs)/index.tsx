import { Bell } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AccueilScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row items-center justify-between bg-surface px-screen-x pb-4 shadow-segmented"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text className="font-sans-bold text-title text-navy">Accueil</Text>
        <View className="rounded-full bg-muted p-2">
          <Bell size={22} color="#1A2B48" />
        </View>
      </View>
      <View className="flex-1 items-center justify-center px-screen-x">
        <View className="max-w-sm rounded-card border border-dashed border-border bg-surface p-8">
          <Text className="text-center font-sans-bold text-subtitle text-navy">Bientot disponible</Text>
          <Text className="font-sans mt-3 text-center text-body text-muted-foreground">
            Tableau de bord et indicateurs cles - placeholder aligne sur la maquette (en-tete +
            zone de contenu).
          </Text>
        </View>
      </View>
    </View>
  );
}
