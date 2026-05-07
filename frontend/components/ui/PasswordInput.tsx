import { Eye, EyeOff } from 'lucide-react-native';
import { Pressable, TextInput, View } from 'react-native';

import {
  PASSWORD_FIELD_INPUT_CLASS,
  PLACEHOLDER_TEXT_COLOR,
} from './fieldInputStyles';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  showPassword: boolean;
  onTogglePassword: () => void;
};

export function PasswordInput({
  value,
  onChangeText,
  onBlur,
  showPassword,
  onTogglePassword,
}: Props) {
  return (
    <View className="relative mt-2">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={!showPassword}
        autoComplete="password"
        placeholder="••••••••"
        placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
        className={PASSWORD_FIELD_INPUT_CLASS}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
        }
        hitSlop={10}
        onPress={onTogglePassword}
        className="absolute bottom-0 right-3 top-0 justify-center"
      >
        {showPassword ? (
          <Eye size={22} color="#9CA3AF" />
        ) : (
          <EyeOff size={22} color="#9CA3AF" />
        )}
      </Pressable>
    </View>
  );
}
