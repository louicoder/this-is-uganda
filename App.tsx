import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const App = () => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(10); // start far away (big scale)

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
    <View style={styles.container}>
      <AnimatedText style={[styles.title, animatedStyle]}>
        This is Uganda
      </AnimatedText>
      <AnimatedText style={[styles.subtitle, animatedStyle]}>
        Coming soon...
      </AnimatedText>
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
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 8,
  },
});

export default App;
