import React from 'react';
import {Pressable, StyleSheet, ViewStyle} from 'react-native';
import {colors, radius, spacing} from '@/design/tokens';
import {AppText} from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost' | 'emergency' | 'danger';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  style?: ViewStyle;
  disabled?: boolean;
};

export function AppButton({title, onPress, variant = 'primary', style, disabled}: Props) {
  const buttonStyle = [
    styles.base,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'ghost' && styles.ghost,
    variant === 'emergency' && styles.emergency,
    variant === 'danger' && styles.danger,
    disabled && styles.disabled,
    style,
  ];

  const textColor =
    variant === 'secondary'
      ? colors.primary
      : variant === 'ghost'
        ? colors.textSecondary
        : colors.text;

  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={buttonStyle}>
      <AppText variant="label" color={variant === 'danger' || variant === 'emergency' ? '#fff' : textColor}>
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    minHeight: 40,
  },
  emergency: {
    backgroundColor: colors.amber,
  },
  danger: {
    backgroundColor: colors.red,
  },
  disabled: {
    opacity: 0.5,
  },
});
