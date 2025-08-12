// src/lifecycle/AppLifecycleManager.ts
/**
 * AppLifecycleManager
 *
 * Responsibilities:
 *  - Listen to RN AppState changes (once).
 *  - Maintain a small event history for debugging.
 *  - Buffer logs to MMKV when backgrounded (Metro WS disconnects) and flush them
 *    when the app returns to foreground.
 *  - Persist last background timestamp so we can compute time-away even across
 *    cold launches.
 *  - Provide helper APIs: onLifecycleState, onBackgroundLongerThan, getHistory.
 */

import { AppState, AppStateStatus } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { appStateSignal, derivedStateSignal, lastBackgroundTimeSignal, timeGapSignal } from '@/signals/appLifecycle';
import { DerivedState, LifecycleCallback, ThresholdListener, HistoryEntry } from '@/types/appLifecycle';

// ---------------------------
// MMKV storage (react-native-mmkv)
// ---------------------------
// We create a small MMKV instance dedicated to lifecycle logs/persistence.
// Using id creates a separate namespace/file which avoids accidental collisions.
const lifecycleLogStore = new MMKV({ id: 'lifecycle_logs' });

// ---------------------------
// Constants & internal state
// ---------------------------
const STORAGE_LAST_BG = 'last_bg_time'; // key for persisted last-background timestamp
const STORAGE_BUFFERED_LOGS = 'bg_logs'; // key for buffered logs

const LONG_PAUSE_THRESHOLD_SEC = 300; // 5 minutes default threshold for "long_pause"

const lifecycleCallbacks: LifecycleCallback[] = []; // subscribers for specific states
const thresholdListeners: ThresholdListener[] = []; // subscribers for "away longer than X"
const history: HistoryEntry[] = []; // small in-memory debug history (last N events)
const HISTORY_MAX = 50; // keep small to avoid memory sprawl

let firstRun = true; // true until we see the first 'active' and handle cold_start
let appStateSubscription: { remove: () => void } | null = null; // to allow cleanup

// ---------------------------
// Buffered logging helpers
// ---------------------------

/**
 * bufferedLog
 *
 * When Metro's WebSocket disconnects in background, console.log messages are lost.
 * To preserve them for debugging, we append them to an MMKV string key and flush
 * them when the app comes back to foreground.
 *
 * - message: the message to append (string)
 */
function bufferedLog(message: string): void {
  try {
    const existing = lifecycleLogStore.getString(STORAGE_BUFFERED_LOGS) || '';
    const entry = `${new Date().toISOString()} — ${message}\n`;
    lifecycleLogStore.set(STORAGE_BUFFERED_LOGS, existing + entry);
  } catch (err) {
    // If MMKV fails for any reason, still swallow the error so logging doesn't crash app.
    // We keep this minimal to avoid interfering with runtime behavior.
    // If you want more robust handling, add instrumentation here (e.g. fallback to file).
    // eslint-disable-next-line no-console
    console.warn('bufferedLog failed', err);
  }
}

/**
 * flushBufferedLogs
 *
 * When app resumes, read buffered logs from MMKV and print them to the console.
 * After printing, clear the stored logs so they are not printed again later.
 */
function flushBufferedLogs(): void {
  try {
    const logs = lifecycleLogStore.getString(STORAGE_BUFFERED_LOGS) || '';
    if (logs.trim().length > 0) {
      // Print as one chunk so the timeline stays together in terminal
      // eslint-disable-next-line no-console
      console.log('📜 Buffered Lifecycle Logs:\n' + logs);
      lifecycleLogStore.delete(STORAGE_BUFFERED_LOGS);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('flushBufferedLogs failed', err);
  }
}

// ---------------------------
// Time helpers
// ---------------------------

/**
 * getTimeGapBreakdown
 *
 * Converts a duration in milliseconds to an easy-to-consume breakdown:
 *  - sec: total seconds (integer)
 *  - min: total minutes (integer)
 *  - hr: total hours (integer)
 *
 * This keeps conversion logic centralized so consumer code doesn't duplicate math.
 */
function getTimeGapBreakdown(diffMs: number) {
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  return { sec, min, hr };
}

// ---------------------------
// History helpers
// ---------------------------

/**
 * addHistory
 *
 * Keeps a small in-memory timeline of state changes for local debugging/inspection.
 * Each entry has { state, ts } where state is either a raw AppStateStatus
 * or a DerivedState string (like 'long_pause').
 *
 * This is intentionally kept in-memory only (not persisted) to avoid storage growth.
 */
function addHistory(state: AppStateStatus | DerivedState): void {
  try {
    history.push({ state, ts: Date.now() });
    if (history.length > HISTORY_MAX) history.shift();
  } catch (err) {
    // Never allow history to crash the app
    // eslint-disable-next-line no-console
    console.warn('addHistory failed', err);
  }
}

/**
 * getHistory
 *
 * Returns a shallow copy of the in-memory event history.
 */
export function getHistory(): HistoryEntry[] {
  return [...history];
}

// ---------------------------
// Threshold listener handling
// ---------------------------

/**
 * Checks registered threshold listeners against the elapsed background time.
 *
 * This function is called when the app transitions from background to foreground.
 * It compares the duration the app was in the background (`diffMs`) against
 * each registered listener’s threshold (`thresholdSec`).
 *
 * If the elapsed time is equal to or exceeds a listener’s threshold, its callback
 * is invoked with detailed timing information.
 *
 * Parameters:
 * ─────────────────────────────────────────────
 * - `diffMs`: number
 *   The elapsed time (in milliseconds) that the app was in the background.
 *
 * Behavior:
 * ─────────────────────────────────────────────
 * - Converts `diffMs` into seconds, minutes, and hours breakdown for convenience.
 * - Iterates over all listeners registered via `onBackgroundLongerThan`.
 * - For each listener:
 *     • If the elapsed seconds (`diffSec`) is >= the listener’s threshold,
 *       the listener’s callback is executed.
 *     • The callback receives an object containing:
 *         { diffMs, diffSec, diffMin, diffHr }
 *
 * Error Handling:
 * ─────────────────────────────────────────────
 * - Exceptions thrown by listener callbacks are caught and logged
 *   to avoid disrupting the lifecycle manager’s internal flow.
 *
 * Use Cases:
 * ─────────────────────────────────────────────
 * - Trigger actions after the app has been inactive for a specified time,
 *   such as refreshing data, prompting the user, or logging analytics.
 *
 * Notes:
 * ─────────────────────────────────────────────
 * - This function is internal and should only be called by lifecycle handlers
 *   that have a valid background duration (typically on resume to foreground).
 * - Threshold listeners only run once per background-to-foreground transition.
 */
function checkThresholdListeners(diffMs: number) {
  const { sec, min, hr } = getTimeGapBreakdown(diffMs);

  thresholdListeners.forEach(({ thresholdSec, callback }) => {
    try {
      if (sec >= thresholdSec) {
        callback({
          diffMs,
          diffSec: sec,
          diffMin: min,
          diffHr: hr,
        });
      }
    } catch (err) {
      // Protect the lifecycle loop from unhandled subscriber errors
      // eslint-disable-next-line no-console
      console.error('Error executing threshold listener:', err);
    }
  });
}

// ---------------------------
// Public subscription APIs
// ---------------------------

/**
 * Registers a callback to be invoked when the app lifecycle enters a specific state.
 *
 * Parameters:
 * ─────────────────────────────────────────────
 * - `targetState`:
 *     The lifecycle state you want to listen for. This can be either:
 *       • A raw React Native `AppStateStatus` string, e.g. `'active'`, `'background'`, `'inactive'`.
 *       • A `DerivedState` string representing higher-level lifecycle phases such as
 *         `'cold_start'`, `'warm_resume'`, `'long_pause'`, etc.
 *
 * - `callback`:
 *     A function to be called whenever the app transitions into the specified `targetState`.
 *     The callback does not receive any arguments.
 *
 * Behavior:
 * ─────────────────────────────────────────────
 * - When the app’s state changes, this manager checks all registered callbacks.
 * - If the new state matches the callback’s `targetState` (either raw or derived), the callback is invoked.
 * - Multiple callbacks can be registered for the same or different states.
 * - This provides a flexible way to react to lifecycle changes without scattering listeners.
 *
 * Usage examples:
 * ─────────────────────────────────────────────
 *   onLifecycleState('background', () => {
 *     // Save app state or pause animations
 *   });
 *
 *   onLifecycleState('long_pause', () => {
 *     // Prompt user to reauthenticate after long inactivity
 *   });
 *
 * Notes:
 * ─────────────────────────────────────────────
 * - Call this early in your app startup (e.g., in `index.tsx`) so you don’t miss events.
 * - This system complements React Native’s native `AppState` but adds higher-level derived states for convenience.
 * - Callbacks should be lightweight and avoid blocking or causing excessive renders.
 */

export function onLifecycleState(targetState: AppStateStatus | DerivedState, callback: () => void): void {
  lifecycleCallbacks.push({ targetState, callback });
}

/**
 * Registers a listener for "long background pause" events.
 *
 * How it works:
 * ─────────────────────────────────────────────
 * - You specify a `thresholdSec` (in seconds) and a `callback`.
 * - If the app was in the background for at least that many seconds
 *   before returning to foreground, the callback will be executed.
 * - The callback receives an object with multiple time breakdowns:
 *      {
 *        diffMs: <milliseconds away>,
 *        diffSec: <seconds away>,
 *        diffMin: <minutes away>,
 *        diffHr: <hours away>
 *      }
 *
 * Trigger timing:
 * ─────────────────────────────────────────────
 * - **Only fires on resume** from background → active.
 * - It does not run while the app is still in background.
 * - All registered listeners are checked inside `checkThresholdListeners()`
 *   during `handleAppStateChange` when resuming.
 *
 * Use cases:
 * ─────────────────────────────────────────────
 * - Show login prompt after being away > X minutes.
 * - Refresh session tokens after a long pause.
 * - Trigger data reload if the app was idle for too long.
 * - Log analytics events for extended inactivity.
 *
 * Example:
 * ─────────────────────────────────────────────
 *   onBackgroundLongerThan(300, ({ diffMin }) => {
 *     console.log(`User was away for ${diffMin} minutes`);
 *     refreshAppData();
 *   });
 *
 * Notes:
 * ─────────────────────────────────────────────
 * - The order of registration matters — call this early (e.g., in `index.tsx`)
 *   so it’s ready before the first lifecycle events happen.
 * - If you need it to fire *while* going to background, you’d need to extend
 *   `handleAppStateChange` to check time thresholds on `background` as well.
 */
export function onBackgroundLongerThan(
  thresholdSec: number,
  callback: (info: { diffMs: number; diffSec: number; diffMin: number; diffHr: number }) => void,
): void {
  thresholdListeners.push({ thresholdSec, callback });
}

// ---------------------------
// Main AppState handler
// ---------------------------

/**
 * Core lifecycle event handler.
 *
 * Triggered automatically by the React Native `AppState` API
 * whenever the app changes state (`active`, `background`, `inactive`).
 *
 * Responsibilities:
 * ─────────────────────────────────────────────
 * 1. **State tracking**
 *    - Updates `appStateSignal` with the new `nextAppState`.
 *    - Adds the new state to a signal-based history array via `addHistory()`.
 *
 * 2. **Derived state updates**
 *    - Sets `derivedStateSignal` to more descriptive lifecycle states:
 *        - `cold_start` → First run since launch.
 *        - `warm_resume` → Came back from background in < LONG_PAUSE_THRESHOLD_SEC.
 *        - `long_pause` → Came back after LONG_PAUSE_THRESHOLD_SEC or more.
 *        - `background` / `inactive` → Direct mappings from AppState.
 *
 * 3. **Background timestamp handling**
 *    - When going to background: stores `Date.now()` into:
 *        - `lastBackgroundTimeSignal` (in-memory).
 *        - MMKV persistent storage under `STORAGE_LAST_BG`.
 *    - This timestamp is later used to calculate time gaps.
 *
 * 4. **Time-gap calculations**
 *    - When resuming from background: calculates `diffMs` between now and the
 *      stored background timestamp.
 *    - Breaks down into seconds/minutes/hours using `getTimeGapBreakdown()`.
 *    - Stores this in `timeGapSignal` for use elsewhere in the app.
 *
 * 5. **Threshold listener execution**
 *    - Passes the `diffMs` to `checkThresholdListeners()`.
 *    - Any listener registered via `onBackgroundLongerThan` whose threshold is met
 *      will have its callback fired.
 *
 * 6. **Lifecycle callback execution**
 *    - Any registered callback via `onLifecycleState` that matches either:
 *        - The raw AppState value (`active`, `background`, etc.)
 *        - The derived state (`long_pause`, `cold_start`, etc.)
 *      will be executed.
 *
 * Special notes:
 * ─────────────────────────────────────────────
 * - This function handles *all* lifecycle scenarios in one place.
 * - `firstRun` is used to ensure the very first `active` state after app launch
 *   is marked as `cold_start`.
 * - Logs are "buffered" into MMKV if they occur in background mode, and are
 *   flushed to console once the app is active again.
 */

function handleAppStateChange(nextAppState: AppStateStatus) {
  const prevState = appStateSignal.value;

  // 1) Update the raw signal immediately (non-reactive consumers can read)
  appStateSignal.value = nextAppState;

  // 2) Add to small in-memory history
  addHistory(nextAppState);

  // 3) Switch on the new state and handle each case
  switch (nextAppState) {
    case 'active': {
      // --- App has come to foreground ---
      // First, flush any buffered logs produced while we were backgrounded
      flushBufferedLogs();

      if (firstRun) {
        // First activation since the JS process started (likely app open)
        derivedStateSignal.value = 'cold_start';
        firstRun = false;
      } else if (lastBackgroundTimeSignal.value) {
        // We have a recorded background timestamp -> measure how long we were away
        const diffMs = Date.now() - lastBackgroundTimeSignal.value;
        timeGapSignal.value = diffMs;

        // Keep a readable buffered log entry so we have a timeline when we inspect logs
        const { sec, min, hr } = getTimeGapBreakdown(diffMs);
        bufferedLog(`App resumed after ${sec}s (${min}m ${hr}h)`);

        // Classify derived state based on threshold
        if (sec >= LONG_PAUSE_THRESHOLD_SEC) {
          derivedStateSignal.value = 'long_pause';
        } else {
          derivedStateSignal.value = 'warm_resume';
        }

        // Notify threshold listeners (e.g., onBackgroundLongerThan subscribers)
        checkThresholdListeners(diffMs);
      } else {
        // No last background timestamp — consider it a cold start
        derivedStateSignal.value = 'cold_start';
      }

      // Call any lifecycleCallbacks interested in either the raw 'active'
      // or the derived state we just set.
      lifecycleCallbacks.forEach(({ targetState, callback }) => {
        try {
          if (targetState === nextAppState || targetState === derivedStateSignal.value) {
            callback();
          }
        } catch (err) {
          // Protect the lifecycle loop from subscriber exceptions
          // eslint-disable-next-line no-console
          console.error('Error in lifecycle callback (active):', err);
        }
      });

      break;
    }

    case 'background': {
      // --- App is going to background ---
      const now = Date.now();

      // Persist the timestamp so we can calculate gap on resume or even after cold restart
      lastBackgroundTimeSignal.value = now;
      // store as string for maximum compatibility with MMKV getter methods
      lifecycleLogStore.set(STORAGE_LAST_BG, String(now));

      derivedStateSignal.value = 'background';

      // Do not console.log(...) here because Metro WS may be disconnected.
      // Instead, buffer the message locally and flush when we next see 'active'.
      bufferedLog(`App moved from ${prevState} → background`);

      // Fire lifecycleCallbacks that explicitly subscribed to 'background'
      lifecycleCallbacks.forEach(({ targetState, callback }) => {
        try {
          if (targetState === 'background') callback();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Error in lifecycle callback (background):', err);
        }
      });

      break;
    }

    case 'inactive': {
      // --- Transient state (iOS) ---
      derivedStateSignal.value = 'inactive';
      bufferedLog(`App moved from ${prevState} → inactive`);

      lifecycleCallbacks.forEach(({ targetState, callback }) => {
        try {
          if (targetState === 'inactive') callback();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Error in lifecycle callback (inactive):', err);
        }
      });
      break;
    }

    default: {
      // Unknown state — buffer the occurrence for later debugging
      bufferedLog(`⚠️ Unknown AppState: ${String(nextAppState)}`);
      break;
    }
  }
}

/**
 * Initializes the App Lifecycle Manager.
 *
 * Responsibilities:
 * ─────────────────────────────────────────────
 * 1. **Registers the `AppState` listener**
 *    - Uses React Native’s built-in `AppState.addEventListener('change', ...)`
 *      to listen for lifecycle changes (`active`, `background`, `inactive`).
 *    - Every time a state change occurs, `handleAppStateChange` is called.
 *
 * 2. **Sets the initial state signals**
 *    - Immediately stores the current app state (`AppState.currentState`)
 *      in `appStateSignal` so that subscribers have the correct state
 *      even before the first change event fires.
 *
 * 3. **Restores last background timestamp (if any)**
 *    - Reads the saved `last_bg_time` value from MMKV (persistent storage).
 *    - If present, loads it into `lastBackgroundTimeSignal` so that
 *      time-gap calculations can work even if the app was killed and restarted.
 *
 * 4. **One-time startup logic**
 *    - Should be called *exactly once* during app startup, typically
 *      at the very beginning of the app lifecycle (e.g., in `index.tsx`).
 *    - If called multiple times, multiple AppState listeners would be
 *      attached — which could cause duplicate events and performance issues.
 *
 * Placement:
 * ─────────────────────────────────────────────
 * - Best placed in `index.tsx` or at the top of your main App entry point.
 * - Call this before rendering your root component so that lifecycle tracking
 *   starts immediately.
 *
 * Example:
 * ─────────────────────────────────────────────
 *   import { initAppLifecycleManager } from './AppLifecycleManager';
 *
 *   initAppLifecycleManager();
 *   AppRegistry.registerComponent(appName, () => App);
 */
export function initAppLifecycleManager(): void {
  // Guard against double initialization
  if (appStateSubscription) return;

  // Attach RN AppState listener (returns object with remove() on modern RN)
  // Keep the subscription so we can remove it on cleanup if necessary.
  appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

  // Ensure signal reflects current runtime state immediately
  appStateSignal.value = AppState.currentState;

  // Try to preload the last background timestamp (persisted across process restarts).
  try {
    const lastBgStr = lifecycleLogStore.getString(STORAGE_LAST_BG);
    if (lastBgStr) {
      const parsed = parseInt(lastBgStr, 10);
      if (!Number.isNaN(parsed)) {
        lastBackgroundTimeSignal.value = parsed;
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to preload last background time from MMKV', err);
  }
}

/**
 * cleanupAppLifecycleManager
 *
 * Unregisters the AppState listener and clears any allocated resources.
 * Useful for tests or if you need to hot-reload this module safely.
 */
export function cleanupAppLifecycleManager(): void {
  try {
    if (appStateSubscription) {
      appStateSubscription.remove();
      appStateSubscription = null;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('cleanupAppLifecycleManager failed', err);
  }
}
