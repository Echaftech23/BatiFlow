import { View } from 'react-native';

type Props = {
  height?: number;
};

/** Curved brand header for auth screens (primary orange → app background). */
export function AuthWaveHeader({ height = 120 }: Props) {
  return (
    <View
      className="w-full rounded-b-[28px] bg-primary"
      style={{ height }}
    />
  );
}
