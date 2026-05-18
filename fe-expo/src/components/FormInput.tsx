import React from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import {colors, radius, spacing, typography} from '@/design/tokens';

export function FormInput(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.textSecondary}
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    color: colors.text,
    ...typography.body,
  },
});
