import React, {useEffect, useRef} from 'react';
import {Animated, Image, ImageSourcePropType, StyleSheet, View} from 'react-native';
import {colors} from '@/design/tokens';

export function CatAvatar({
  source,
  size = 56,
  lost,
}: {
  source: ImageSourcePropType;
  size?: number;
  lost?: boolean;
}) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!lost) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [lost, pulse]);

  const avatar = <Image source={source} style={[styles.image, {width: size, height: size, borderRadius: size / 2}]} />;

  if (!lost) {
    return avatar;
  }

  const animatedStyle = {
    opacity: pulse.interpolate({inputRange: [0, 1], outputRange: [0.45, 1]}),
    transform: [{scale: pulse.interpolate({inputRange: [0, 1], outputRange: [0.96, 1.04]})}],
  };

  return (
    <Animated.View style={[styles.lostRing, {borderRadius: size / 2 + 4}, animatedStyle]}>
      <View style={{padding: 3}}>{avatar}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  lostRing: {
    borderWidth: 2,
    borderColor: colors.red,
  },
});
