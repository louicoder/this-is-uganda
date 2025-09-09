import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, useDerivedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, runOnUI } from 'react-native-worklets';
import Typography from './Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Tab {
  key: string;
  title: string;
  content?: string;
}

interface Props {
  tabs: Tab[];
}

const CustomTabsWithPanV4: React.FC<Props> = ({ tabs }) => {
  const tabCount = tabs.length;
  const tabWidth = SCREEN_WIDTH / tabCount;
  const activeIndex = useSharedValue(0);
  const translateX = useSharedValue(0);

  // Handle programmatic tab change
  const setActiveTab = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(tabCount - 1, index));
    activeIndex.value = clampedIndex;

    runOnUI(() => {
      'worklet';
      translateX.value = withTiming(-clampedIndex * SCREEN_WIDTH, { duration: 300 });
    })();
  };

  const onTabPress = (index: number) => {
    setActiveTab(index);
  };

  // Pan gesture to swipe between tabs
  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = -activeIndex.value * SCREEN_WIDTH + event.translationX;
    })
    .onEnd(event => {
      const velocity = event.velocityX;
      const direction = velocity < 0 ? 1 : -1;
      let nextIndex = activeIndex.value + direction;

      // Clamp to stay within tab bounds
      nextIndex = Math.max(0, Math.min(tabCount - 1, nextIndex));

      runOnJS(setActiveTab)(nextIndex);
    });

  const indicatorStyle = useAnimatedStyle(() => {
    'worklet';

    // translateX.value goes from 0 (first tab) to -(tabCount - 1)*SCREEN_WIDTH (last tab)
    // Map it to indicator translateX from 0 to (tabCount - 1)*tabWidth

    const maxTranslateX = (tabCount - 1) * SCREEN_WIDTH;
    const progress = -translateX.value / maxTranslateX; // 0 to 1

    return {
      transform: [
        {
          translateX: progress * (tabCount - 1) * tabWidth,
        },
      ],
    };
  });

  const pagerStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      width: SCREEN_WIDTH * tabCount,
      flexDirection: 'row',
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Tab bar */}
      <View style={styles.tabRow}>
        {tabs.map((tab, index) => (
          <TouchableOpacity key={tab.key} style={[styles.tab, { width: tabWidth }]} onPress={() => onTabPress(index)}>
            <Text style={styles.tabText}>{tab.title}</Text>
          </TouchableOpacity>
        ))}
        <Animated.View style={[styles.indicator, { width: tabWidth }, indicatorStyle]} />
      </View>

      {/* Swipeable pager */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[pagerStyle, { flex: 1 }]}>
          {tabs.map(tab => (
            <View key={tab.key} style={[styles.page, { width: SCREEN_WIDTH }]}>
              <Typography text={tab?.content ?? ''} />
            </View>
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    position: 'relative',
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  indicator: {
    height: 3,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomTabsWithPanV4;
