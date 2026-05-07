import { Text } from 'react-native';

type Props = {
  message?: string;
  className?: string;
};

const DEFAULT_CLASS =
  'font-sans mt-1 text-medium text-destructive leading-none tracking-normal';

export function FieldError({ message, className }: Props) {
  if (!message) return null;
  return <Text className={className ?? DEFAULT_CLASS}>{message}</Text>;
}
