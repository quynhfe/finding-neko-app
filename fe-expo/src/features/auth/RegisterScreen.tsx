import React, {useState} from 'react';
import {Alert} from 'react-native';
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

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({navigation}: Props) {
  const {signUp, loading, error} = useAuth();
  const [fullName, setFullName] = useState('Lan Nguyen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit() {
    try {
      await signUp({fullName, email, password});
    } catch {
      Alert.alert('Không tạo được tài khoản', error || 'Kiểm tra backend hoặc dữ liệu nhập.');
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
        <FormInput placeholder="Tên của bạn" value={fullName} onChangeText={setFullName} />
        <FormInput autoCapitalize="none" keyboardType="email-address" placeholder="Email" value={email} onChangeText={setEmail} />
        <FormInput secureTextEntry placeholder="Mật khẩu tối thiểu 6 ký tự" value={password} onChangeText={setPassword} />
        <AppButton title={loading ? 'Đang tạo...' : 'Tạo tài khoản'} disabled={loading} onPress={submit} />
        <AppButton title="Đã có tài khoản? Đăng nhập" variant="ghost" onPress={() => navigation.navigate('Login')} />
      </Card>
    </Screen>
  );
}
