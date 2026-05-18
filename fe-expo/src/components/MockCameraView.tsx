import React, {PropsWithChildren} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {colors, spacing} from '@/design/tokens';
import {images} from '@/services/mockData';

export function MockCameraView({children, emergency}: PropsWithChildren<{emergency?: boolean}>) {
  return (
    <ImageBackground source={emergency ? images.street : images.miu} style={styles.root} imageStyle={styles.image}>
      <View style={[styles.overlay, emergency && styles.emergencyOverlay]}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 560,
    backgroundColor: colors.camera,
  },
  image: {
    opacity: 0.6,
  },
  overlay: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  emergencyOverlay: {
    backgroundColor: 'rgba(255,140,0,0.12)',
  },
});
