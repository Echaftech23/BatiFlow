import { Pressable, Text, View } from 'react-native';

type GlobalErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function GlobalErrorState({
  title = 'Une erreur est survenue',
  message = 'Merci de reessayer dans quelques instants.',
  onRetry,
}: GlobalErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <View className="w-full rounded-card border border-destructive/40 bg-destructive/10 p-4">
        <Text className="font-sans-semibold text-body text-destructive">{title}</Text>
        <Text className="mt-2 font-sans text-caption text-muted-foreground">{message}</Text>
        {onRetry ? (
          <Pressable
            onPress={onRetry}
            className="mt-4 rounded-button border border-border bg-surface py-3"
          >
            <Text className="text-center font-sans-semibold text-caption text-navy">
              Reessayer
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
