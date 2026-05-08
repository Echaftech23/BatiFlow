import type { ReactNode } from 'react';
import { View } from 'react-native';

import { FieldError } from './FieldError';
import { FieldLabel } from './FieldLabel';

type Props = {
  label: string;
  labelRequired?: boolean;
  error?: string;
  /** Shown after the input, before the error (e.g. password strength). */
  footer?: ReactNode;
  /** Adds top spacing between stacked fields; false for the first field or custom layouts. */
  stacked?: boolean;
  children: ReactNode;
  errorClassName?: string;
};

export function FormField({
  label,
  labelRequired = true,
  error,
  footer,
  stacked = true,
  children,
  errorClassName,
}: Props) {
  return (
    <View className={stacked ? 'mt-4' : undefined}>
      <FieldLabel required={labelRequired}>{label}</FieldLabel>
      {children}
      {footer}
      <FieldError message={error} className={errorClassName} />
    </View>
  );
}
