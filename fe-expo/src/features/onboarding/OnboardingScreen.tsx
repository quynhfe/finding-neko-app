import React, {useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View} from 'react-native';
import {Screen} from '@/components/Screen';
import {MascotImage} from '@/components/MascotImage';
import {AppText} from '@/components/AppText';
import {AppButton} from '@/components/AppButton';
import {Badge} from '@/components/Badge';
import {Card} from '@/components/Card';
import type {RootStackParamList} from '@/application/navigationTypes';
import {colors, spacing} from '@/design/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const steps = [
  ['Để chụp mèo siêu cute', 'Finding Neko cần camera để tạo diary, challenge và báo thấy mèo.'],
  ['Tìm mèo quanh bạn', 'Vị trí giúp Radar chỉ gửi cảnh báo mèo lạc gần khu bạn sống.'],
  ['Neko tìm thấy rồi', 'Tạo hồ sơ mèo đầu tiên để mở khóa trải nghiệm chính.'],
];

export function OnboardingScreen({navigation}: Props) {
  const [index, setIndex] = useState(0);
  const current = steps[index];

  function next() {
    if (index < steps.length - 1) {
      setIndex(index + 1);
      return;
    }
    navigation.replace('CatSetup');
  }

  return (
    <Screen>
      <MascotImage size={220} />
      <View style={{flexDirection: 'row', justifyContent: 'center', gap: spacing.sm}}>
        {steps.map((_, i) => (
          <Badge key={i} label=" " tone={i === index ? 'yellow' : 'gray'} />
        ))}
      </View>
      <Card>
        <AppText variant="h1" center>
          {current?.[0]}
        </AppText>
        <AppText center color={colors.textSecondary}>
          {current?.[1]}
        </AppText>
      </Card>
      <AppButton title={index === steps.length - 1 ? 'Chụp ảnh mèo đầu tiên' : 'Tiếp tục'} onPress={next} />
      <AppButton title="Vào app luôn" variant="ghost" onPress={() => navigation.replace('Main')} />
    </Screen>
  );
}
