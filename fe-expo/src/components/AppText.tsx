import React, {PropsWithChildren} from 'react';
import {Text, TextProps, TextStyle} from 'react-native';
import {colors, typography} from '@/design/tokens';

type Variant = keyof typeof typography;

type Props = PropsWithChildren<
  TextProps & {
    variant?: Variant;
    color?: string;
    center?: boolean;
    style?: TextStyle | TextStyle[];
  }
>;

export function AppText({children, variant = 'body', color = colors.text, center, style, ...props}: Props) {
  return (
    <Text
      {...props}
      style={[typography[variant], {color, textAlign: center ? 'center' : 'left'}, style]}>
      {children}
    </Text>
  );
}
