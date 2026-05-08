import { ActivityIndicator, Text, View } from 'react-native';

type GlobalLoaderProps = {
  label?: string;
};

export function GlobalLoader({ label = 'Chargement…' }: GlobalLoaderProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <ActivityIndicator size="large" color="#F27427" />
      <Text className="mt-4 text-center font-sans text-caption text-muted-foreground">
        {label}
      </Text>
    </View>
  );
}
