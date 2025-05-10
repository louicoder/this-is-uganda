import {ThemePreference} from '@/types/theme';
import {signal} from '@preact/signals-react';

export const themePreference = signal<ThemePreference>('system');
