import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/index';
import { useTheme } from '@/hooks/useTheme';
import { RFVALUE } from '@/constants/index';
import { LucideHome, LucideMoon, LucideSun } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSignals } from '@preact/signals-react/runtime';
import { useSignal } from '@preact/signals-react';
import { onBackgroundLongerThan } from '@/helpers/appLifecycleManager';
import { ThresholdCallbackParams } from '@/types/appLifecycle';

export default function Home({ navigation }) {
  useSignals();
  const timeAway = useSignal<ThresholdCallbackParams>({ diffHr: 0, diffMin: 0, diffMs: 0, diffSec: 0 });
  const { toggleTheme, isDarkMode } = useTheme();
  const { top: TOP } = useSafeAreaInsets();
  const themeStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

  onBackgroundLongerThan(5, diff => {
    timeAway.value = diff;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={{}}>
          <View style={{ height: TOP, ...themeStyle }} />
          <View style={[styles.header, themeStyle]}>
            <LucideHome style={{ marginRight: RFVALUE(10) }} color={isDarkMode ? '#fff' : '#000'} />
            <Typography text="Home" size={16} color={isDarkMode ? '#fff' : '#000'} />
          </View>
        </View>
      ),
    });
  }, [navigation, isDarkMode, TOP]);

  const toggleDarkMode = () => toggleTheme();

  return (
    <View style={[styles.container, themeStyle, { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' }]}>
      <Typography text={`Time away from app\n`} style={{ textAlign: 'center' }} size={20} color={isDarkMode ? '#fff' : '#000'}>
        <Typography
          size={30}
          text={`${timeAway.value?.diffMin} mins   |   ${timeAway.value?.diffSec > 60 ? timeAway.value?.diffSec % 60 : timeAway.value?.diffSec} secs `}
          color={isDarkMode ? '#aaa' : '#000'}
        />
      </Typography>

      <TouchableOpacity style={[styles.themeToggle, { borderColor: isDarkMode ? '#aaa' : '#ddd' }]} onPress={toggleDarkMode}>
        {isDarkMode ? <LucideSun color={isDarkMode ? '#aaa' : 'black'} size={30} /> : <LucideMoon color={isDarkMode ? '#aaa' : 'black'} size={30} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    height: RFVALUE(50),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: RFVALUE(10),
  },
  themeToggle: {
    width: RFVALUE(40),
    height: RFVALUE(40),
    position: 'absolute',
    bottom: RFVALUE(10),
    right: RFVALUE(10),
    borderWidth: RFVALUE(1),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RFVALUE(5),
  },
});
