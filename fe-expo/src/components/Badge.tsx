import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {colors, radius, spacing} from '@/design/tokens';
import {AppText} from './AppText';

type Props = {
  label: string;
  tone?: 'yellow' | 'green' | 'pink' | 'lavender' | 'amber' | 'red' | 'gray';
  style?: ViewStyle;
};

export function Badge({label, tone = 'yellow', style}: Props) {
  return (
    <View style={[styles.base, styles[tone], style]}>
      <AppText variant="caption" color={tone === 'amber' || tone === 'red' ? '#fff' : colors.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  yellow: {backgroundColor: colors.primary},
  green: {backgroundColor: colors.success},
  pink: {backgroundColor: colors.pink},
  lavender: {backgroundColor: colors.lavender},
  amber: {backgroundColor: colors.amber},
  red: {backgroundColor: colors.red},
  gray: {backgroundColor: colors.border},
});
