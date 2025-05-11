// Typography.types.ts

import {ReactNode} from 'react';
import {TextProps} from 'react-native';

export interface TypographyProps extends TextProps {
  children?: ReactNode;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  size?: number;
  lines?: number;
  onPress?: () => void;
  onLongPress?: () => void;
  align?: 'left' | 'center' | 'right' | 'justify';
  transform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  text: string;
}
