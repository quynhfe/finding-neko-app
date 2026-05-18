import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '@/components/Screen';
import {Card} from '@/components/Card';
import {AppText} from '@/components/AppText';
import {AppButton} from '@/components/AppButton';
import {Badge} from '@/components/Badge';
import {MockCameraView} from '@/components/MockCameraView';
import {Reticle} from '@/components/Reticle';
import {mockApi} from '@/services/mockApi';
import {todayChallenge} from '@/services/mockData';
import type {RootStackParamList} from '@/application/navigationTypes';
import {colors, radius, spacing} from '@/design/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'ChallengeFlow'>;

export function ChallengeHomeScreen({navigation}: any) {
  return (
    <Screen>
      <Card>
        <Badge label="Daily Neko Challenge" />
        <AppText variant="h1">{todayChallenge.title}</AppText>
        <AppText color={colors.textSecondary}>{todayChallenge.prompt}</AppText>
        <Image source={todayChallenge.silhouette} style={styles.silhouette} />
        <AppButton title="Mở camera challenge" onPress={() => navigation.navigate('ChallengeFlow')} />
      </Card>
    </Screen>
  );
}

export function ChallengeFlowScreen({navigation}: Props) {
  const [score, setScore] = useState<number | null>(null);

  if (score === null) {
    return (
      <MockCameraView>
        <View>
          <Badge label="Boss ngáp ngủ" />
        </View>
        <View style={styles.center}>
          <Image source={todayChallenge.silhouette} style={styles.overlaySilhouette} />
          <Reticle />
          <AppText color="#fff" center>Căn dáng mèo theo khung mờ</AppText>
        </View>
        <AppButton
          title="Chụp và chấm điểm"
          onPress={async () => setScore((await mockApi.scoreChallenge()).score)}
        />
      </MockCameraView>
    );
  }

  return (
    <Screen>
      <Card>
        <Badge label={score >= 80 ? 'Điểm cao' : 'Cần thử lại'} tone={score >= 80 ? 'green' : 'amber'} />
        <Image source={todayChallenge.silhouette} style={styles.resultImage} />
        <AppText variant="hero" center>{score}%</AppText>
        <AppText variant="h1" center>{score >= 80 ? 'Tuyệt cú mèo!' : 'Miu đang hơi lệch dáng'}</AppText>
        <AppText center color={colors.textSecondary}>Finding Neko watermark đã sẵn sàng để chia sẻ.</AppText>
        <AppButton title="Đăng lên feed" onPress={() => navigation.navigate('Main')} />
        <AppButton title="Chụp lại" variant="secondary" onPress={() => setScore(null)} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  silhouette: {width: '100%', height: 220, borderRadius: radius.lg},
  overlaySilhouette: {width: 180, height: 130, resizeMode: 'contain', opacity: 0.75},
  resultImage: {width: '100%', height: 260, borderRadius: radius.lg},
  center: {alignItems: 'center', gap: spacing.md},
});
