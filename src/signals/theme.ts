import {ThemePreference} from '@/types/theme';
import {signal} from '@preact/signals-react';

/**
 * Signal representing the user's preferred theme.
 */
export const themePreference = signal<ThemePreference>('system');
