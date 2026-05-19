import React, {useState} from 'react';
import {View} from 'react-native';
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
import {AuthErrorModal} from './AuthErrorModal';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({navigation}: Props) {
  const {signIn, loading} = useAuth();
  const [identifier, setIdentifier] = useState('demo');
  const [password, setPassword] = useState('123456');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submit() {
    try {
      await signIn({identifier, password});
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Kiểm tra backend hoặc tài khoản.');
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
        <FormInput autoCapitalize="none" placeholder="Email hoặc username" value={identifier} onChangeText={setIdentifier} />
        <FormInput secureTextEntry placeholder="Mật khẩu" value={password} onChangeText={setPassword} />
        <AppButton title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'} disabled={loading} onPress={submit} />
        <AppButton title="Tạo tài khoản mới" variant="ghost" onPress={() => navigation.navigate('Register')} />
      </Card>
      <View>
        <AppText variant="caption" color={colors.textSecondary} center>
          Backend: POST /api/auth/login
        </AppText>
      </View>
      <AuthErrorModal message={errorMessage} onClose={() => setErrorMessage(null)} />
    </Screen>
  );
}
