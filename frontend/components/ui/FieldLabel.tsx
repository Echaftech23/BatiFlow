import { Text } from 'react-native';
import { View } from 'react-native';

type Props = {
  children: string;
  required?: boolean;
};

export function FieldLabel({ children, required = true }: Props) {
  return (
    <View className="w-full flex-row justify-between mt-5">
      <Text className="flex-1 font-sans-medium text-medium text-muted-foreground leading-none tracking-normal">{children}</Text>
      {required ? <Text className="flex-none font-sans-medium text-medium text-destructive leading-none tracking-normal"> *</Text> : null}
    </View>
  );
}
