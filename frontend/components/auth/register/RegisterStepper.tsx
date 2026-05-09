import { Check } from 'lucide-react-native';
import { Text, View } from 'react-native';

const STEPS = [
  { n: 1 as const, label: 'Identité' },
  { n: 2 as const, label: 'Accès' },
  { n: 3 as const, label: 'CGU' },
];

function RegisterStepItem({
  stepNumber,
  label,
  active,
  done,
}: {
  stepNumber: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  const circleClass = done
    ? 'h-10 w-10 items-center justify-center rounded-full border-2 border-navy bg-navy'
    : active
      ? 'h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary'
      : 'h-10 w-10 items-center justify-center rounded-full border-2 border-[#D1D5DB] bg-surface';
  const digitClass = active
    ? 'font-bold text-[16px] leading-[24px] text-center text-on-primary'
    : 'font-bold text-[16px] leading-[24px] text-center text-[#9CA3AF]';
  const labelClass = done
    ? 'font-semibold leading-none tracking-normal mt-2 text-center text-caption text-navy'
    : active
      ? 'font-semibold leading-none tracking-normal mt-2 text-center text-caption text-primary'
      : 'font-semibold leading-none tracking-normal mt-2 text-center text-caption text-[#9CA3AF]';

  return (
    <View className="z-[1]">
      <View className={circleClass}>
        {done ? (
          <Check size={17} color="#FFFFFF" strokeWidth={2.6} />
        ) : (
          <Text className={digitClass}>{stepNumber}</Text>
        )}
      </View>
      <Text className={labelClass}>{label}</Text>
    </View>
  );
}

type Props = {
  currentStep: 1 | 2 | 3;
};

export function RegisterStepper({ currentStep }: Props) {
  return (
    <View className="my-10 px-6">
      <View className="relative flex-row justify-between pt-1">
        <View
          className="absolute left-[8%] w-[84%] top-[22px] h-[2px] bg-[#D1D5DB]"
          pointerEvents="none"
        />
        {STEPS.map((step) => (
          <RegisterStepItem
            key={step.n}
            stepNumber={step.n}
            label={step.label}
            active={step.n === currentStep}
            done={step.n < currentStep}
          />
        ))}
      </View>
    </View>
  );
}
