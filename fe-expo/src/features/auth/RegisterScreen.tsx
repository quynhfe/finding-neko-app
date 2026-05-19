import React, {useState} from 'react';
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

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({navigation}: Props) {
  const {signUp, loading} = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submit() {
    try {
      const nextEmail = await signUp({username, email, password});
      navigation.navigate('VerifyOtp', {username, email: nextEmail, password});
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Kiểm tra backend hoặc dữ liệu nhập.');
    }
  }

  return (
    <Screen>
      <MascotImage size={130} />
      <Card>
        <AppText variant="h1" center>
          Tạo tài khoản
        </AppText>
        <AppText color={colors.textSecondary} center>
          Bắt đầu hành trình cùng Neko
        </AppText>
        <FormInput autoCapitalize="none" placeholder="Username" value={username} onChangeText={setUsername} />
        <FormInput autoCapitalize="none" keyboardType="email-address" placeholder="Email" value={email} onChangeText={setEmail} />
        <FormInput secureTextEntry placeholder="Mật khẩu tối thiểu 6 ký tự" value={password} onChangeText={setPassword} />
        <AppButton title={loading ? 'Đang gửi OTP...' : 'Đăng ký'} disabled={loading} onPress={submit} />
        <AppButton title="Đã có tài khoản? Đăng nhập" variant="ghost" onPress={() => navigation.navigate('Login')} />
      </Card>
      <AuthErrorModal message={errorMessage} onClose={() => setErrorMessage(null)} />
    </Screen>
  );
}
