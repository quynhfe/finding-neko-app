import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Screen} from '@/components/Screen';
import {Card} from '@/components/Card';
import {AppText} from '@/components/AppText';
import {AppButton} from '@/components/AppButton';
import {Badge} from '@/components/Badge';
import {diaryEntries} from '@/services/mockData';
import {radius, spacing} from '@/design/tokens';

export function DiaryScreen() {
  const latest = diaryEntries[0];
  return (
    <Screen>
      <AppText variant="h1">Cat Diary</AppText>
      <Card style={styles.widget}>
        <Image source={latest.image} style={styles.widgetImage} />
        <View style={styles.widgetOverlay}>
          <AppText variant="h1" color="#fff">{latest.caption}</AppText>
          <AppText variant="caption" color="#fff">Từ: {latest.author} • {latest.createdAt}</AppText>
        </View>
      </Card>
      <AppButton title="Chụp khoảnh khắc mới" />
      <View style={styles.grid}>
        {diaryEntries.map(entry => (
          <Card key={entry.id} style={styles.tile}>
            <Image source={entry.image} style={styles.tileImage} />
            <Badge label={entry.createdAt} />
            <AppText variant="label">{entry.caption}</AppText>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  widget: {padding: 0, overflow: 'hidden', height: 180},
  widgetImage: {width: '100%', height: '100%', position: 'absolute'},
  widgetOverlay: {flex: 1, justifyContent: 'flex-end', padding: spacing.lg, backgroundColor: 'rgba(0,0,0,0.28)'},
  grid: {gap: spacing.md},
  tile: {padding: spacing.sm},
  tileImage: {height: 180, borderRadius: radius.md, width: '100%'},
});
