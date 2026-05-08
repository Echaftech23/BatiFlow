import { Text, View } from 'react-native';

import { passwordStrengthRatio } from '@/shared/utils/passwordStrength';

type Props = {
  password: string;
};

export function PasswordStrengthBar({ password }: Props) {
  const ratio = passwordStrengthRatio(password);
  const pct = Math.min(100, Math.round(ratio * 100));

  return (
    <View className="my-4">
      <View className="flex-row justify-between">
        <Text className="font-normal leading-[100%] tracking-normal text-badge text-muted-foreground">Faible</Text>
        <Text className="font-normal leading-[100%] tracking-normal text-badge text-muted-foreground">sécurisé</Text>
      </View>
      <View className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <View className="h-full rounded-full bg-navy" style={{ width: `${pct}%` }} />
      </View>
    </View>
  );
}
