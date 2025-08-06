import { RFVALUE } from '@/constants/index';
import { isRadioPlayerVisible } from '@/signals/global';
import { isRadioPlaying } from '@/signals/radio';
import { useSignalEffect } from '@preact/signals-react';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, cancelAnimation, Easing } from 'react-native-reanimated';
import { runOnUI } from 'react-native-worklets';

type VisualizerProps = {
  color: string;
  maxHeight?: number;
};
const Visualizer: React.FC<VisualizerProps> = ({ color = '#00ffdf', maxHeight = 30 }) => {
  const MIN_HEIGHT = RFVALUE(0);
  const height1 = useSharedValue<number>(MIN_HEIGHT);
  const height2 = useSharedValue<number>(MIN_HEIGHT);
  const height3 = useSharedValue<number>(MIN_HEIGHT);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const MAX_HEIGHT = RFVALUE(maxHeight);

  const getRandomHeight = () => Math.floor(Math.random() * (MAX_HEIGHT - MIN_HEIGHT + 1)) + MIN_HEIGHT;
  const heights = [height1, height2, height3];

  useSignalEffect(() => {
    // We use this to pause the animation when the player is no longer visible
    // This helps with memory management. Only animating when it's visible.
    if (isRadioPlayerVisible.value === false) stopAnimations();
  });

  useSignalEffect(() => {
    if (isRadioPlaying.value) {
      // Start animation loop
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          animate();
        }, 100);
      }
    } else {
      // Stop animation loop and then
      // Cancel current animations when the play is paused or stops playing
      stopAnimations();
    }
  });

  const stopAnimations = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    runOnUI(() => {
      'worklet';
      heights.forEach(cancelAnimation);
    })();
  };

  const animate = () => {
    const nextHeight1 = RFVALUE(getRandomHeight());
    const nextHeight2 = RFVALUE(getRandomHeight());
    const nextHeight3 = RFVALUE(getRandomHeight());

    runOnUI(() => {
      'worklet';
      height1.value = withTiming(nextHeight1, { easing: Easing.inOut(Easing.ease) });
      height2.value = withTiming(nextHeight2, { easing: Easing.inOut(Easing.ease) });
      height3.value = withTiming(nextHeight3, { easing: Easing.inOut(Easing.ease) });
    })();
  };

  const animatedStyle1 = useAnimatedStyle(() => {
    'worklet';
    return { height: height1.value };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    'worklet';
    return { height: height2.value };
  });

  const animatedStyle3 = useAnimatedStyle(() => {
    'worklet';
    return { height: height3.value };
  });

  const colorStyle = useAnimatedStyle(() => {
    'worklet';
    return { backgroundColor: color };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, colorStyle, animatedStyle1]} />
      <Animated.View style={[styles.bar, colorStyle, animatedStyle2]} />
      <Animated.View style={[styles.bar, colorStyle, animatedStyle3]} />
    </View>
  );
};

export default Visualizer;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    height: RFVALUE(30),
    flexDirection: 'row',
    gap: RFVALUE(3),
    borderColor: '#fff',
    width: RFVALUE(24),
  },
  bar: {
    width: RFVALUE(6),
    borderRadius: 10,
  },
});
