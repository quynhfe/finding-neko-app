import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {colors} from '@/design/tokens';

export function Reticle({mode = 'vitamin'}: {mode?: 'vitamin' | 'emergency'}) {
  const pulse = useRef(new Animated.Value(0)).current;
  const color = mode === 'emergency' ? colors.amber : colors.primary;

  useEffect(() => {
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
  }, [pulse]);

  const animatedStyle = {
    opacity: pulse.interpolate({inputRange: [0, 1], outputRange: [0.65, 1]}),
    transform: [{scale: pulse.interpolate({inputRange: [0, 1], outputRange: [0.92, 1.08]})}],
  };

  return (
    <Animated.View style={[styles.reticle, {borderColor: color}, animatedStyle]} />
  );
}

const styles = StyleSheet.create({
  reticle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderStyle: 'dashed',
  },
});
