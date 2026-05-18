import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Screen} from '@/components/Screen';
import {Card} from '@/components/Card';
import {AppText} from '@/components/AppText';
import {Badge} from '@/components/Badge';
import {leaderboard} from '@/services/mockData';
import {colors, spacing} from '@/design/tokens';

export function LeaderboardScreen() {
  return (
    <Screen>
      <AppText variant="h1">Bảng xếp hạng</AppText>
      <Card style={styles.podium}>
        <AppText variant="h2" center>Top khu vực Đà Nẵng hôm nay</AppText>
        <View style={styles.topRow}>
          {leaderboard.slice(0, 3).map(entry => (
            <View key={entry.id} style={styles.topItem}>
              <Image source={entry.avatar} style={styles.avatar} />
              <Badge label={`#${entry.rank}`} tone={entry.rank === 1 ? 'yellow' : 'lavender'} />
              <AppText variant="label" center>{entry.name}</AppText>
              <AppText variant="caption" center>⭐ {entry.stars}</AppText>
            </View>
          ))}
        </View>
      </Card>
      {leaderboard.map(entry => (
        <Card key={entry.id} style={entry.isCurrentUser ? styles.current : undefined}>
          <View style={styles.row}>
            <AppText variant="h2">#{entry.rank}</AppText>
            <Image source={entry.avatar} style={styles.smallAvatar} />
            <View style={{flex: 1}}>
              <AppText variant="label">{entry.name}</AppText>
              <AppText color={colors.textSecondary}>⭐ {entry.stars} • 🔥 {entry.streak} ngày</AppText>
            </View>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  podium: {backgroundColor: colors.yellowTint},
  topRow: {flexDirection: 'row', justifyContent: 'space-around'},
  topItem: {alignItems: 'center', gap: spacing.sm, flex: 1},
  avatar: {width: 58, height: 58, borderRadius: 29},
  smallAvatar: {width: 44, height: 44, borderRadius: 22},
  row: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  current: {borderWidth: 2, borderColor: colors.primary},
});
