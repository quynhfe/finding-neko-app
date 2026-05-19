import React from 'react';
import {Image, ImageStyle, StyleSheet} from 'react-native';
import {images} from '@/services/mockData';

export function MascotImage({size = 180, style}: {size?: number; style?: ImageStyle}) {
  return <Image source={images.neko} style={[styles.image, {width: size, height: size}, style]} />;
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
