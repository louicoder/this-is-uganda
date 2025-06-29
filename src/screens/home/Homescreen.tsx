
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Typography } from '@/components/index';
import { useTheme } from '@/hooks/useTheme';

export default function Home () {
  const { toggleTheme, isDarkMode } = useTheme();

  const toggleDarkMode = () => toggleTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <Button title="Press Me Here" pressable onPress={toggleDarkMode} />
      <Typography text="Test" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
