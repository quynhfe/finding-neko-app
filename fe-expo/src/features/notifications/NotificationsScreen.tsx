import React from 'react';
import {View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '@/components/Screen';
import {Card} from '@/components/Card';
import {AppText} from '@/components/AppText';
import {Badge} from '@/components/Badge';
import {AppButton} from '@/components/AppButton';
import {notifications} from '@/services/mockData';
import type {RootStackParamList} from '@/application/navigationTypes';
import {colors, spacing} from '@/design/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export function NotificationsScreen({navigation}: Props) {
  return (
    <Screen>
      <AppText variant="h1">Thông báo</AppText>
      {notifications.map(item => (
        <Card key={item.id} style={item.type === 'lost' ? {backgroundColor: colors.amberTint} : undefined}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md}}>
            <View style={{flex: 1}}>
              <Badge label={item.type === 'lost' ? 'Khẩn cấp' : 'Hoạt động'} tone={item.type === 'lost' ? 'amber' : 'yellow'} />
              <AppText variant="h2">{item.title}</AppText>
              <AppText color={colors.textSecondary}>{item.body}</AppText>
              <AppText variant="caption" color={colors.textSecondary}>{item.createdAt}</AppText>
            </View>
          </View>
          {item.type === 'lost' && <AppButton title="Mở Radar" variant="emergency" onPress={() => navigation.navigate('RadarFlow')} />}
        </Card>
      ))}
    </Screen>
  );
}
