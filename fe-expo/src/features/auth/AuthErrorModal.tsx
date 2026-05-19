import React from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {AppButton} from '@/components/AppButton';
import {AppText} from '@/components/AppText';
import {colors, radius, shadow, spacing} from '@/design/tokens';

type Props = {
  message: string | null;
  onClose: () => void;
};

export function AuthErrorModal({message, onClose}: Props) {
  return (
    <Modal transparent visible={Boolean(message)} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.panel}>
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
            <AppText variant="h2">x</AppText>
          </Pressable>
          <View style={styles.body}>
            <AppText variant="h2">Error:</AppText>
            <AppText color={colors.textSecondary}>{message}</AppText>
          </View>
          <AppButton title="Cancel" variant="danger" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: spacing.lg,
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    minHeight: 190,
    borderRadius: radius.md,
    backgroundColor: '#fff',
    padding: spacing.lg,
    gap: spacing.lg,
    ...shadow.card,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  body: {
    paddingTop: spacing.xl,
    gap: spacing.sm,
  },
});
