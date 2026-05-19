import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '@/components/Screen';
import {AppText} from '@/components/AppText';
import {AppButton} from '@/components/AppButton';
import {Card} from '@/components/Card';
import {Badge} from '@/components/Badge';
import {FormInput} from '@/components/FormInput';
import {images} from '@/services/mockData';
import type {RootStackParamList} from '@/application/navigationTypes';
import {colors, radius, spacing} from '@/design/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'CatSetup'>;

export function CatSetupScreen({navigation}: Props) {
  const [step, setStep] = useState(0);

  return (
    <Screen>
      <AppText variant="h1">Hồ sơ mèo mới</AppText>
      <Badge label={`Bước ${step + 1}/3`} />
      {step === 0 && (
        <Card>
          <AppText variant="h1">Ảnh nhận diện mèo</AppText>
          <AppText color={colors.textSecondary}>Upload 3-5 ảnh để AI học nhận diện bé.</AppText>
          <View style={styles.grid}>
            {[images.miu, images.miu, images.street, null, null].map((image, index) => (
              <View key={index} style={styles.slot}>
                {image ? <Image source={image} style={styles.photo} /> : <AppText variant="hero" center>+</AppText>}
              </View>
            ))}
          </View>
          <Badge label="AI đang học nhận diện Miu..." tone="green" />
        </Card>
      )}
      {step === 1 && (
        <Card>
          <AppText variant="h1">Kể về bé mèo</AppText>
          <FormInput value="Miu" placeholder="Tên mèo" />
          <View style={styles.row}>
            {['Mèo ta', 'Munchkin', 'British Shorthair'].map((item, index) => (
              <Badge key={item} label={item} tone={index === 0 ? 'yellow' : 'gray'} />
            ))}
          </View>
          <AppText variant="label">AI phát hiện đặc điểm</AppText>
          {['Lông ngắn vàng nâu', 'Có sọc tabby', 'Mắt xanh'].map(item => (
            <Badge key={item} label={`✓ ${item}`} tone="lavender" />
          ))}
        </Card>
      )}
      {step === 2 && (
        <Card>
          <Image source={images.miu} style={styles.heroCat} />
          <AppText variant="h1" center>Miu đã có hồ sơ rồi!</AppText>
          <AppText center color={colors.textSecondary}>Độ chín hồ sơ: 72%. Lost Mode đã sẵn sàng.</AppText>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </Card>
      )}
      <AppButton
        title={step < 2 ? 'Tiếp theo' : 'Vào trang chủ'}
        onPress={() => (step < 2 ? setStep(step + 1) : navigation.replace('Main'))}
      />
      <AppButton title="Bỏ qua" variant="ghost" onPress={() => navigation.replace('Main')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slot: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.yellowTint,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: {width: '100%', height: '100%'},
  row: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  heroCat: {width: 140, height: 140, borderRadius: 70, alignSelf: 'center'},
  progressTrack: {height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden'},
  progressFill: {width: '72%', height: '100%', backgroundColor: colors.primary},
});
