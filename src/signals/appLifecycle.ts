/**
 * ─────────────────────────────────────────────────────────────
 *  GLOBAL SIGNALS FOR APP STATE LIFECYCLE MANAGER
 * ─────────────────────────────────────────────────────────────
 * Signals from @preact/signals-react are reactive variables that
 * can be used in UI without causing unnecessary re-renders elsewhere.
 * They hold values globally and update subscribed components.
 */

import { DerivedState } from '@/types/appLifecycle';
import { signal } from '@preact/signals-react';
import { AppState, AppStateStatus } from 'react-native';

// Holds the raw AppState from React Native ('active', 'background', 'inactive')
export const appStateSignal = signal<AppStateStatus>(AppState.currentState);

// Holds the derived state ("background" | "inactive" | "cold_start" | "warm_resume" | "long_pause")
export const derivedStateSignal = signal<DerivedState>('cold_start');

// Timestamp of when app last went to background
export const lastBackgroundTimeSignal = signal<number | null>(null);

// Gap between background → foreground in milliseconds
export const timeGapSignal = signal<number | null>(null);
