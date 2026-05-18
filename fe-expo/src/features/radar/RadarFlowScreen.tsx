import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '@/components/Screen';
import {MockCameraView} from '@/components/MockCameraView';
import {Reticle} from '@/components/Reticle';
import {Card} from '@/components/Card';
import {AppText} from '@/components/AppText';
import {AppButton} from '@/components/AppButton';
import {Badge} from '@/components/Badge';
import {CatAvatar} from '@/components/CatAvatar';
import {lostCases} from '@/services/mockData';
import {mockApi} from '@/services/mockApi';
import type {RootStackParamList} from '@/application/navigationTypes';
import {colors, radius, spacing} from '@/design/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'RadarFlow'>;

export function RadarFlowScreen({navigation}: Props) {
  const [mode, setMode] = useState<'list' | 'scan' | 'submitted'>('list');
  const lost = lostCases[0];

  if (mode === 'scan') {
    return (
      <MockCameraView emergency>
        <Badge label={`Đang quét - ${lost.cat.name}`} tone="amber" />
        <View style={styles.center}>
          <Reticle mode="emergency" />
          <AppText color="#fff" center>Chĩa camera vào con mèo bạn thấy</AppText>
        </View>
        <AppButton
          title="Chụp và gửi báo cáo"
          variant="emergency"
          onPress={async () => {
            await mockApi.analyzeSighting();
            setMode('submitted');
          }}
        />
      </MockCameraView>
    );
  }

  if (mode === 'submitted') {
    return (
      <Screen>
        <Card>
          <Badge label="Đã gửi báo cáo" tone="green" />
          <AppText variant="h1">Đang chờ chủ mèo xác nhận</AppText>
          <Image source={lost.cat.avatar} style={styles.photo} />
          <AppText color={colors.textSecondary}>Liên hệ của bạn chỉ được chia sẻ sau khi chủ mèo xác nhận ảnh.</AppText>
          <AppButton title="Về trang chính" onPress={() => navigation.navigate('Main')} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText variant="h1">Radar mèo lạc gần bạn</AppText>
      <Badge label="📍 Cầu Rồng, Đà Nẵng • Trong 5km" tone="green" />
      <Card style={styles.lostCard}>
        <View style={styles.row}>
          <CatAvatar source={lost.cat.avatar} lost />
          <View style={{flex: 1}}>
            <Badge label="Mất mèo" tone="amber" />
            <AppText variant="h2">{lost.cat.name}</AppText>
            <AppText color={colors.textSecondary}>{lost.cat.breed} • {lost.distanceMeters}m từ bạn</AppText>
          </View>
        </View>
        <AppButton title="Báo đã thấy" variant="emergency" onPress={() => setMode('scan')} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: spacing.md, alignItems: 'center'},
  lostCard: {borderLeftWidth: 4, borderLeftColor: colors.amber},
  center: {alignItems: 'center', gap: spacing.md},
  photo: {height: 240, width: '100%', borderRadius: radius.lg},
});
