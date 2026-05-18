import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '@/components/Screen';
import {Card} from '@/components/Card';
import {AppText} from '@/components/AppText';
import {AppButton} from '@/components/AppButton';
import {Badge} from '@/components/Badge';
import {CatAvatar} from '@/components/CatAvatar';
import {lostCases, sightings} from '@/services/mockData';
import type {RootStackParamList} from '@/application/navigationTypes';
import {colors, radius, spacing} from '@/design/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'LostFlow'>;

export function LostFlowScreen({navigation}: Props) {
  const [confirmed, setConfirmed] = useState(false);
  const lost = lostCases[0];
  const report = sightings[0];

  if (confirmed) {
    return (
      <Screen>
        <Badge label="Lost Mode đã tắt" tone="green" />
        <Card>
          <AppText variant="hero" center>Đã tìm thấy!</AppText>
          <CatAvatar source={lost.cat.avatar} size={140} />
          <AppText center>Béo đã về nhà nhờ Huy Nguyen.</AppText>
          <Badge label="+50 sao cứu trợ" tone="yellow" style={{alignSelf: 'center'}} />
          <AppButton title="Về trang chính" onPress={() => navigation.navigate('Main')} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Badge label="⚠️ Lost Mode đang bật" tone="amber" />
      <Card style={styles.alertCard}>
        <View style={styles.row}>
          <CatAvatar source={lost.cat.avatar} size={76} lost />
          <View style={{flex: 1}}>
            <AppText variant="h1">{lost.cat.name} đang mất</AppText>
            <AppText color={colors.textSecondary}>{lost.lastSeen} • {lost.reportedAt}</AppText>
            <AppText>{lost.notifiedCount} người đã được thông báo</AppText>
          </View>
        </View>
      </Card>
      <Card>
        <AppText variant="h2">Báo cáo mới</AppText>
        <Image source={report.photo} style={styles.photo} />
        <Badge label={`${report.confidence}% khớp AI`} tone="amber" />
        <AppText>{report.locationLabel}</AppText>
        <AppText color={colors.textSecondary}>Thông tin liên hệ chưa mở khóa cho đến khi bạn xác nhận ảnh.</AppText>
        <AppButton title="Xác nhận đúng là Béo" variant="emergency" onPress={() => setConfirmed(true)} />
        <AppButton title="Từ chối báo cáo" variant="secondary" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  alertCard: {backgroundColor: colors.amberTint},
  row: {flexDirection: 'row', gap: spacing.md, alignItems: 'center'},
  photo: {height: 220, borderRadius: radius.md, width: '100%'},
});
