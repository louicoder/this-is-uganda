import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Typography } from '@/components/index';
import { useTheme } from '@/hooks/useTheme';
import Radios from '@/components/Radios';
import SlideToStart from '@/components/SlideToStart';
import { RFVALUE } from '@/constants/index';
import { LucideHome, LucideMoon, LucideSun } from 'lucide-react-native';
import TabBar from '@/components/Tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Home({ navigation }) {
  const { toggleTheme, isDarkMode } = useTheme();
  const { top: TOP } = useSafeAreaInsets();

  const themeStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

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
      {/* <SlideToStart /> */}
      <Typography text="Coming soon..." size={18} color="#aaa" />
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
