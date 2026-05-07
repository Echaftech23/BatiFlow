import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import {
  FIELD_INPUT_CLASS,
  PLACEHOLDER_TEXT_COLOR,
} from './fieldInputStyles';

type Props = TextInputProps & {
  /** Override default field styling */
  inputClassName?: string;
};

export const AppTextInput = forwardRef<TextInput, Props>(function AppTextInput(
  { className, inputClassName, placeholderTextColor, ...rest },
  ref,
) {
  const mergedClass = inputClassName ?? className ?? FIELD_INPUT_CLASS;
  return (
    <TextInput
      ref={ref}
      placeholderTextColor={placeholderTextColor ?? PLACEHOLDER_TEXT_COLOR}
      className={mergedClass}
      {...rest}
    />
  );
});
