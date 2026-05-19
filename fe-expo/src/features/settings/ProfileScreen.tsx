import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '@/components/Screen';
import {Card} from '@/components/Card';
import {AppText} from '@/components/AppText';
import {AppButton} from '@/components/AppButton';
import {Badge} from '@/components/Badge';
import {cats} from '@/services/mockData';
import {useAuth} from '@/application/AuthContext';
import type {MainTabParamList, RootStackParamList} from '@/application/navigationTypes';
import {colors, radius, spacing} from '@/design/tokens';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ProfileScreen({navigation}: Props) {
  const {user} = useAuth();
  return (
    <Screen>
      <Card>
        <AppText variant="h1">{user?.fullName || user?.email || 'Lan Nguyen'}</AppText>
        <AppText color={colors.textSecondary}>@finding.neko</AppText>
        <View style={styles.row}>
          <Badge label="⭐ 145 sao" />
          <Badge label="🔥 8 ngày" tone="amber" />
          <Badge label="3 huy hiệu" tone="lavender" />
        </View>
      </Card>
      {cats.map(cat => (
        <Card key={cat.id}>
          <View style={styles.row}>
            <Image source={cat.avatar} style={styles.cat} />
            <View style={{flex: 1}}>
              <AppText variant="h2">{cat.name}</AppText>
              <AppText color={colors.textSecondary}>{cat.breed} • {cat.age} tuổi</AppText>
              <Badge label={`Độ chín ${cat.maturity}%`} tone={cat.isLost ? 'amber' : 'green'} />
            </View>
          </View>
          {cat.isLost && <AppButton title="Mở Lost Mode Dashboard" variant="emergency" onPress={() => navigation.navigate('LostFlow')} />}
        </Card>
      ))}
      <AppButton title="Cat Diary Widget Mock" onPress={() => navigation.navigate('DiaryDetail')} />
      <AppButton title="Cài đặt" variant="secondary" onPress={() => navigation.navigate('Settings')} />
      <AppButton title="Leaderboard" variant="secondary" onPress={() => navigation.navigate('Leaderboard')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: spacing.md, alignItems: 'center', flexWrap: 'wrap'},
  cat: {width: 72, height: 72, borderRadius: radius.md},
});
