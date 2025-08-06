import { StyleSheet, View } from 'react-native';
import React, { useCallback } from 'react';
import { useSignalEffect, useSignals } from '@preact/signals-react/runtime';
import { isRadioPlayerVisible } from '@/signals/global';
import { runOnUI } from 'react-native-worklets';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useResponsiveFontSize } from '@/hooks/useResponsiveScreen';
import Typography from './Typography';
import { LucideHeart, LucidePause, LucidePlay, LucideX } from 'lucide-react-native';
import { AudioPro } from 'react-native-audio-pro';
import { activeTrack, isRadioPlaying } from '@/signals/radio';
import Visualizer from './Visualizer';
import { useTheme } from '@/hooks/useTheme';
import { RFVALUE, WIDTH } from '@/constants/index';

const RadioPlayer: React.FC = () => {
  useSignals();
  const { BOTTOM, HEIGHT } = useResponsiveFontSize();
  const TAB = RFVALUE(50);
  const viewHeight = RFVALUE(70);
  const height = useSharedValue(HEIGHT);
  const padding = RFVALUE(5);
  const { isDarkMode } = useTheme();

  useSignalEffect(() => {
    const visible = isRadioPlayerVisible.value;
    if (visible) showPlayer();
    else hidePlayer();
  });

  const playAudioTrack = () => {
    isRadioPlayerVisible.value = true;
    AudioPro.play(activeTrack.value);
    isRadioPlaying.value = true;
  };

  const togglePlay = useCallback(() => {
    if (isRadioPlaying.value) {
      AudioPro.stop();
      isRadioPlaying.value = false;
    } else {
      AudioPro.play(activeTrack.value);
      isRadioPlaying.value = true;
    }
  }, [activeTrack.value, isRadioPlaying.value]);

  useSignalEffect(() => {
    const track = activeTrack.value;
    if (track?.url !== '') playAudioTrack();
  });

  const showPlayer = () => {
    runOnUI(() => {
      'worklet';
      height.value = withTiming(height.value - (viewHeight + TAB - padding));
    })();
  };

  const hidePlayer = () => {
    runOnUI(() => {
      'worklet';
      height.value = withTiming(HEIGHT);
    })();
  };

  const playerStyles = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateY: height.value }],
    };
  });

  const closePayerHandler = useCallback(() => {
    isRadioPlayerVisible.value = false;
  }, []);

  return (
    <Animated.View style={[styles.mainContainer, { height: viewHeight }, playerStyles]}>
      <Animated.View style={[styles.container, { backgroundColor: isDarkMode ? '#000000ff' : '#000', height: viewHeight, marginBottom: BOTTOM }]}>
        <View style={styles.textContainer}>
          <Visualizer color="#fff" />
          <View style={{ paddingLeft: RFVALUE(10) }}>
            <Typography text={activeTrack.value?.title} color="#ffffff" size={16} numberOfLines={1} />
            <Typography text={activeTrack.value?.website} color="#aaa" size={12} numberOfLines={1} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: 0.3 * (0.95 * WIDTH) }}>
          <LucideHeart color="#ff0000" fill="transparent" />
          {isRadioPlaying.value ? (
            <LucidePause color="#fff" style={{ marginHorizontal: RFVALUE(10) }} onPress={togglePlay} />
          ) : (
            <LucidePlay color="#fff" onPress={togglePlay} style={{ marginHorizontal: RFVALUE(10) }} />
          )}
          <LucideX color="#ffffff" onPress={closePayerHandler} />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default RadioPlayer;

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    width: '100%',
    zIndex: 100000000,
    overflow: 'hidden',
  },
  container: {
    flex: 1,

    width: '95%',
    alignSelf: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    marginRight: 10,
    width: 0.65 * (0.95 * WIDTH),
    paddingLeft: RFVALUE(10),
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
