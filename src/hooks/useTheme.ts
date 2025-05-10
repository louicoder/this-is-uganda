// src/hooks/useTheme.ts
import {Appearance} from 'react-native';
import {signal, computed, useSignal} from '@preact/signals-react';
import {useSignals} from '@preact/signals-react/runtime';
import {themePreference} from '@/signals/theme';
import {ThemePreference, UseThemeReturn} from '@/types/theme';

// 2. Signal to track system color scheme
const systemTheme = signal<'light' | 'dark'>(
  Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
);

// 3. Listen to system changes
Appearance.addChangeListener(({colorScheme}) => {
  if (colorScheme) {
    systemTheme.value = colorScheme === 'dark' ? 'dark' : 'light';
  }
});

// 4. Compute the effective theme
const effectiveTheme = computed(() =>
  themePreference.value === 'system'
    ? systemTheme.value
    : themePreference.value,
);

const isDarkMode = computed(() => effectiveTheme.value === 'dark');

// 5. Hook
export const useTheme = (): UseThemeReturn => {
  useSignals();
  useSignal(themePreference);
  useSignal(effectiveTheme);

  /**
   * Sets the user's theme preference.
   * Use `'light'`, `'dark'`, or `'system'`.
   */
  const setThemePreference = (pref: ThemePreference) => {
    themePreference.value = pref;
  };

  /**
   * Toggles between light and dark theme.
   * If current theme is dark, switches to light, and vice versa.
   * Does not toggle to/from system mode.
   */
  const toggleTheme = () => {
    const current = effectiveTheme.value;
    themePreference.value = current === 'dark' ? 'light' : 'dark';
  };

  return {
    /** Whether the effective theme is dark mode */
    isDarkMode: isDarkMode.value,

    /** The user's selected preference: 'light', 'dark', or 'system' */
    preference: themePreference.value,

    /** Whether the app is following the system theme */
    isUsingSystem: themePreference.value === 'system',

    setThemePreference,
    toggleTheme,
  };
};
