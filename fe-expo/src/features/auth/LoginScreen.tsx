import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '@/components/Screen';
import {MascotImage} from '@/components/MascotImage';
import {AppText} from '@/components/AppText';
import {FormInput} from '@/components/FormInput';
import {AppButton} from '@/components/AppButton';
import {Card} from '@/components/Card';
import {useAuth} from '@/application/AuthContext';
import type {AuthStackParamList} from '@/application/navigationTypes';
import {colors} from '@/design/tokens';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({navigation}: Props) {
  const {signIn, loading, error} = useAuth();
  const [email, setEmail] = useState('demo@findingneko.app');
  const [password, setPassword] = useState('123456');

  async function submit() {
    try {
      await signIn({email, password});
    } catch {
      Alert.alert('Không đăng nhập được', error || 'Kiểm tra backend hoặc tài khoản.');
    }
  }

  return (
    <Screen>
      <MascotImage size={150} />
      <Card>
        <AppText variant="h1" center>
          Chào mừng trở lại!
        </AppText>
        <AppText color={colors.textSecondary} center>
          Neko đang chờ bạn~
        </AppText>
        <FormInput autoCapitalize="none" keyboardType="email-address" placeholder="Email" value={email} onChangeText={setEmail} />
        <FormInput secureTextEntry placeholder="Mật khẩu" value={password} onChangeText={setPassword} />
        <AppButton title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'} disabled={loading} onPress={submit} />
        <AppButton title="Tạo tài khoản mới" variant="ghost" onPress={() => navigation.navigate('Register')} />
      </Card>
      <View>
        <AppText variant="caption" color={colors.textSecondary} center>
          Backend: POST /api/auth/login
        </AppText>
      </View>
    </Screen>
  );
}
