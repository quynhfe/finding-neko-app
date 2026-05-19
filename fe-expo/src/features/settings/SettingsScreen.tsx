import React from 'react';
import {Switch, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '@/components/Screen';
import {Card} from '@/components/Card';
import {AppText} from '@/components/AppText';
import {AppButton} from '@/components/AppButton';
import {useAuth} from '@/application/AuthContext';
import type {RootStackParamList} from '@/application/navigationTypes';
import {colors} from '@/design/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({navigation}: Props) {
  const {signOut} = useAuth();
  const rows = ['Thông báo Daily Challenge', 'Thông báo mèo lạc gần tôi', 'Thông báo tương tác'];
  return (
    <Screen>
      <AppText variant="h1">Cài đặt</AppText>
      <Card>
        {rows.map(row => (
          <View key={row} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <AppText>{row}</AppText>
            <Switch value thumbColor={colors.primary} />
          </View>
        ))}
      </Card>
      <Card>
        {['Hồ sơ cá nhân', 'Bảo mật', 'Widget màn hình chính', 'Chính sách quyền riêng tư'].map(row => (
          <AppText key={row}>{row} →</AppText>
        ))}
      </Card>
      <AppButton title="Đăng xuất" variant="danger" onPress={async () => { await signOut(); }} />
      <AppButton title="Quay lại" variant="ghost" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
