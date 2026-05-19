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
import {AuthErrorModal} from './AuthErrorModal';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyOtp'>;

export function VerifyOtpScreen({navigation, route}: Props) {
  const {verifyRegistrationOtp, loading} = useAuth();
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {username, email, password} = route.params;

  async function submit() {
    try {
      const message = await verifyRegistrationOtp({username, email, password, otp});
      Alert.alert('Xác minh thành công', message, [
        {
          text: 'Đăng nhập',
          onPress: () => navigation.replace('Login'),
        },
      ]);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Kiểm tra mã OTP hoặc thử đăng ký lại.');
    }
  }

  return (
    <Screen>
      <MascotImage size={130} />
      <Card>
        <AppText variant="h1" center>
          Nhập mã OTP
        </AppText>
        <AppText color={colors.textSecondary} center>
          Mã xác nhận đã được gửi tới {email}
        </AppText>
        <FormInput keyboardType="number-pad" maxLength={6} placeholder="Mã OTP 6 chữ số" value={otp} onChangeText={setOtp} />
        <AppButton title={loading ? 'Đang xác nhận...' : 'Xác nhận OTP'} disabled={loading} onPress={submit} />
        <AppButton title="Quay lại đăng ký" variant="ghost" onPress={() => navigation.goBack()} />
      </Card>
      <AuthErrorModal message={errorMessage} onClose={() => setErrorMessage(null)} />
    </Screen>
  );
}
