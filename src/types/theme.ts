// src/types/theme.d.ts

export type ThemePreference = 'light' | 'dark' | 'system';

export type UseThemeReturn = {
  /** Whether the effective theme is dark mode */
  isDarkMode: boolean;

  /** The user's selected preference: 'light', 'dark', or 'system' */
  preference: ThemePreference;

  /** Whether the app is following the system theme */
  isUsingSystem: boolean;

  /** Set the user's theme preference */
  setThemePreference: (pref: ThemePreference) => void;

  /** Toggle between light and dark mode */
  toggleTheme: () => void;
};
