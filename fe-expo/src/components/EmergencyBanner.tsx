import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors, radius, spacing} from '@/design/tokens';
import {AppText} from './AppText';

export function EmergencyBanner({text}: {text: string}) {
  return (
    <View style={styles.banner}>
      <AppText variant="label" color="#fff">
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.amber,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
});
