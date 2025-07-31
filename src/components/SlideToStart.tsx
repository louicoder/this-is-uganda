import React, { useState } from 'react';
import { View, StyleSheet, Text, LayoutChangeEvent } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  Extrapolate,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const SlideToStart = () => {
  const transX = useSharedValue(0);
  const ctx = useSharedValue({ x: 0 });
  const [trackWidth, setTrackWidth] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [text, setText] = useState('Slide to Start');

  const onTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const onThumbLayout = (event: LayoutChangeEvent) => {
    setThumbWidth(event.nativeEvent.layout.width);
  };

  const updateText = (progress: number) => {
    if (progress >= 1) {
      setText('Completed!');
    }  else if (progress > 0.3) {
      setText('Keep sliding...');
    } else {
      setText('Slide to Start');
    }
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      ctx.value = { x: transX.value };
    })
    .onUpdate((event) => {
      'worklet';
      const newPosition = ctx.value.x + event.translationX;
      const maxDrag = trackWidth - thumbWidth;

      transX.value = interpolate(
        newPosition,
        [0, maxDrag],
        [0, maxDrag],
        'clamp'
      );

      // Update text based on progress
      const progress = transX.value / maxDrag;
      runOnJS(updateText)(progress);
    })
    .onEnd(() => {
      'worklet';
      const maxDrag = trackWidth - thumbWidth;
      const progress = transX.value / maxDrag;

      // if (progress === 1) { // 95% completion threshold
      //   runOnJS(setText)('Completed!');
      //   // Trigger your completion action here
      // } else {
      //   transX.value = withSpring(0, {
      //     overshootClamping: true,
      //   });
      //   runOnJS(setText)('Slide to Start');
      // }
      if(progress !== 1) transX.value = 0
    });

  const dragStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateX: transX.value }],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      width: transX.value + thumbWidth,
      backgroundColor: 'rgba(0, 122, 255, 0.3)',
      ...StyleSheet.absoluteFillObject,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.track} onLayout={onTrackLayout}>
        <Animated.View style={[styles.progress, progressStyle]} />
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[styles.draggable, dragStyle]}
            onLayout={onThumbLayout}
          />
        </GestureDetector>
        <Text style={styles.statusText}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    borderWidth:1
  },
  track: {
    height: 50,
    width: 300,
    backgroundColor: '#ddd',
    borderRadius: 25,
    justifyContent: 'center',
  },
  progress: {
    borderRadius: 25,
  },
  draggable: {
    height: 50,
    width: 50,
    backgroundColor: '#000',
    borderRadius: 25,
    position: 'absolute',
    left: 0,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    position: 'absolute',
    alignSelf: 'center',
  },
});

export default SlideToStart;
