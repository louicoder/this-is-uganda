/**
 * ─────────────────────────────────────────────────────────────
 *  TYPE DEFINITIONS
 * ─────────────────────────────────────────────────────────────
 */
/**
 * Derived state is our own higher-level state classification,
 * built from raw AppState + timing logic.
 */
import { AppStateStatus } from 'react-native';

export type DerivedState =
  | 'cold_start' // App opened fresh after being killed
  | 'warm_resume' // Returned to foreground after a short time
  | 'long_pause' // Returned after a long absence
  | 'background' // Currently running in background
  | 'inactive'; // Transient state (e.g., incoming call, screen lock)

/**
 * Data passed into background duration threshold callbacks.
 */
export interface ThresholdCallbackParams {
  diffMs: number; // Time away in milliseconds
  diffSec: number; // Time away in seconds
  diffMin: number; // Time away in minutes
  diffHr: number; // Time away in hours
}

/**
 * Internal type for storing threshold listeners.
 */
export interface ThresholdListener {
  thresholdSec: number;
  callback: (params: ThresholdCallbackParams) => void;
}

/**
 * Internal type for event history entries.
 */
export interface HistoryEntry {
  state: AppStateStatus | DerivedState;
  ts: number; // timestamp in ms
}

/**
 * LifecycleCallback
 *
 * Represents a subscription to a specific app lifecycle state.
 * `targetState` can be either:
 *  - A raw `AppStateStatus` ('active' | 'background' | 'inactive')
 *  - A `DerivedState` ('cold_start' | 'warm_resume' | 'long_pause' etc.)
 *
 * When the `targetState` occurs, the `callback` is invoked with no arguments.
 */
export type LifecycleCallback = {
  targetState: AppStateStatus | DerivedState;
  callback: () => void;
};
