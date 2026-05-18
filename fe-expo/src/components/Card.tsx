import React, {PropsWithChildren} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {colors, radius, shadow, spacing} from '@/design/tokens';

export function Card({children, style}: PropsWithChildren<{style?: ViewStyle | ViewStyle[]}>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow.card,
  },
});
