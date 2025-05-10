import {useTheme} from '@/hooks/useTheme';
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Switch, TouchableOpacity} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {Moon, Sun} from 'lucide-react-native';

const App = () => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(10); // start far away (big scale)
  const {toggleTheme, isDarkMode} = useTheme();

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });

    scale.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{scale: scale.value}],
    };
  });

  const AnimatedText = Animated.createAnimatedComponent(Text);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? 'black' : 'white'},
      ]}>
      <AnimatedText
        style={[
          styles.title,
          animatedStyle,
          {color: isDarkMode ? 'white' : 'black'},
        ]}
        onPress={toggleTheme}>
        This is Uganda
      </AnimatedText>
      <AnimatedText style={[styles.subtitle, animatedStyle]}>
        Coming soon...
      </AnimatedText>

      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          position: 'absolute',
          top: 15,
          right: 15,
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {!isDarkMode ? (
          <Moon size={30} color={'black'} />
        ) : (
          <Sun size={30} color={'white'} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 8,
  },
});

export default App;
