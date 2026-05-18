import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {MockCameraView} from '@/components/MockCameraView';
import {AppText} from '@/components/AppText';
import {Badge} from '@/components/Badge';
import {CatAvatar} from '@/components/CatAvatar';
import {Reticle} from '@/components/Reticle';
import {EmergencyBanner} from '@/components/EmergencyBanner';
import {cats} from '@/services/mockData';
import {colors, radius, spacing} from '@/design/tokens';

export function HomeScreen({navigation}: any) {
  return (
    <MockCameraView>
      <View style={styles.top}>
        <View style={styles.profile}>
          <CatAvatar source={cats[0].avatar} />
          <View>
            <AppText variant="label" color="#fff">Miu an toàn</AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.8)">Streak 8 ngày</AppText>
          </View>
        </View>
        <Pressable onPress={() => navigation.navigate('Notifications')}>
          <Badge label="🔔" />
        </Pressable>
      </View>
      <EmergencyBanner text="⚠️ Béo đang Lost Mode - 412 người đã nhận cảnh báo" />
      <View style={styles.center}>
        <Reticle />
        <AppText variant="label" color="#fff" center>Chĩa vào mèo của bạn...</AppText>
      </View>
      <View style={styles.bottom}>
        <Pressable style={styles.small} onPress={() => navigation.navigate('DiaryDetail' as never)}>
          <AppText color="#fff">Diary</AppText>
        </Pressable>
        <Pressable style={styles.capture} onPress={() => navigation.navigate('ChallengeFlow')}>
          <AppText variant="hero">📸</AppText>
        </Pressable>
        <Pressable style={styles.small} onPress={() => navigation.navigate('LostFlow')}>
          <AppText color="#fff">SOS</AppText>
        </Pressable>
      </View>
    </MockCameraView>
  );
}

const styles = StyleSheet.create({
  top: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  profile: {flexDirection: 'row', gap: spacing.sm, alignItems: 'center'},
  center: {alignItems: 'center', gap: spacing.md},
  bottom: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  capture: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    width: 70,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
