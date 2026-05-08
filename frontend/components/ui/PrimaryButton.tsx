import {
  ActivityIndicator,
  Pressable,
  Text,
  type ViewStyle,
} from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  style?: ViewStyle;
};

const DEFAULT_CLASS = 'mt-8 rounded-pill bg-primary py-4 disabled:opacity-60';
const DEFAULT_TEXT_CLASS = 'text-center font-sans-semibold text-body text-on-primary';

export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  className,
  textClassName,
  style,
}: Props) {
  const busy = disabled || loading;
  return (
    <Pressable
      disabled={busy}
      onPress={onPress}
      className={className ?? DEFAULT_CLASS}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className={textClassName ?? DEFAULT_TEXT_CLASS}>{title}</Text>
      )}
    </Pressable>
  );
}
