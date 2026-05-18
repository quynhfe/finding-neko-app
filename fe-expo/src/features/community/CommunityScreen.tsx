import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Screen} from '@/components/Screen';
import {Card} from '@/components/Card';
import {AppText} from '@/components/AppText';
import {Badge} from '@/components/Badge';
import {feedPosts} from '@/services/mockData';
import {colors, radius} from '@/design/tokens';

export function CommunityScreen() {
  return (
    <Screen>
      <AppText variant="h1">Neko Community</AppText>
      {feedPosts.map(post => (
        <Card key={post.id}>
          <View style={styles.header}>
            <View>
              <AppText variant="label">{post.catName}</AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                {post.ownerName} • {post.createdAt}
              </AppText>
            </View>
            <Badge label={`❤ ${post.likes}`} tone="pink" />
          </View>
          <Image source={post.image} style={styles.image} />
          <AppText>{post.caption}</AppText>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  image: {width: '100%', height: 260, borderRadius: radius.md},
});
