import React from 'react';
import {
  TouchableOpacity,
  Pressable,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  ActivityIndicator,
  Text,
  StyleProp,
  StyleSheet,
} from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

type IconAlignment = 'left' | 'right';
type ButtonSize = 'small' | 'medium' | 'large';

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  styles?: StyleProp<ViewStyle & TextStyle>;
  iconName?: keyof typeof LucideIcons;
  loading?: boolean;
  iconAlignment?: IconAlignment;
  iconTextPadding?: number;
  pressable?: boolean;
  disabled?: boolean;
  size?: ButtonSize;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  styles,
  iconName,
  loading = false,
  iconAlignment = 'left',
  iconTextPadding = 5,
  pressable = false,
  disabled = false,
  size = 'small',
}) => {
  const { isDarkMode } = useTheme();
  const isDisabled = disabled || loading;

  const flattenedStyles = StyleSheet.flatten(styles) || {};
  const {
    backgroundColor = '#007bff',
    color = 'white',
    borderRadius = 4,
    marginBottom = 0,
    marginTop = 0,
    ...restStyles
  } = flattenedStyles as any;

  const heightMap: Record<ButtonSize, number> = {
    small: 40,
    medium: 50,
    large: 60,
  };

  const containerStyle: StyleProp<ViewStyle> = [
    {
      backgroundColor: isDisabled ? '#aaa' : isDarkMode ? '#333' : backgroundColor,
      borderRadius,
      marginBottom,
      marginTop,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: isDisabled ? 0.7 : 1,
      height: heightMap[size],
      width: '100%',
    },
    restStyles,
  ];

  const textStyle: StyleProp<TextStyle> = {
    color,
    fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (!isDisabled) {
      onPress(event);
    }
  };

  const IconComponent = iconName ? LucideIcons?.[iconName] as React.ComponentType<any> | undefined : undefined;

  const Wrapper = pressable ? Pressable : TouchableOpacity;

  return (
    <Wrapper
      onPress={handlePress}
      disabled={isDisabled}
      style={containerStyle}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <>
          {iconAlignment === 'left' && IconComponent && (
            <IconComponent
              size={20}
              color={color}
              style={{ marginRight: iconTextPadding }}
              accessibilityIgnoresInvertColors
            />
          )}
          <Text style={textStyle}>{title}</Text>
          {iconAlignment === 'right' && IconComponent && (
            <IconComponent
              size={20}
              color={color}
              style={{ marginLeft: iconTextPadding }}
              accessibilityIgnoresInvertColors
            />
          )}
        </>
      )}
    </Wrapper>
  );
};

export default CustomButton;
