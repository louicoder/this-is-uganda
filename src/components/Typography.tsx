import React from 'react';
import {Text} from 'react-native';
import {TypographyProps} from '@/components/index';
import styles from './styles';

const Typography: React.FC<TypographyProps> = ({
  children,
  color = '#000',
  bold = false,
  italic = false,
  underline = false,
  size = 16,
  lines,
  onPress,
  onLongPress,
  align = 'left',
  transform = 'none',
  style,
  text,
  ...rest
}) => {
  // Determine the fontFamily based on italic and bold props
  let fontFamily = 'Roboto-Regular';

  if (bold && italic) {
    fontFamily = 'Roboto-BoldItalic';
  } else if (bold) {
    fontFamily = 'Roboto-Bold';
  } else if (italic) {
    fontFamily = 'Roboto-Italic';
  }

  return (
    <Text
      numberOfLines={lines}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.typography,
        {
          color,
          fontFamily,
          fontWeight: bold ? 'bold' : 'normal',
          fontStyle: italic ? 'italic' : 'normal',
          textDecorationLine: underline ? 'underline' : 'none',
          fontSize: size,
          textAlign: align,
          textTransform: transform,
        },
        style,
      ]}
      {...rest}>
      {text}
      {children}
    </Text>
  );
};

export default Typography;
