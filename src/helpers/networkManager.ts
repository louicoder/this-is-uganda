import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { isConnected } from '@/signals/global';

/**
 * Configuration object for NetInfo network reachability checks.
 *
 * These options tune how network connectivity is detected and tested.
 * You can customize these based on your app’s requirements or regional
 * network conditions.
 *
 * Properties:
 * ─────────────────────────────────────────────
 * - reachabilityUrl:
 *     URL to ping to test internet connectivity (Google's fast no-content URL).
 * - reachabilityTest:
 *     Function that tests if the fetch response is successful (status 204).
 * - reachabilityLongTimeout:
 *     Timeout for longer reachability checks (in milliseconds).
 * - reachabilityShortTimeout:
 *     Timeout for quicker checks (in milliseconds).
 * - reachabilityRequestTimeout:
 *     Max time to wait for the request before aborting.
 * - reachabilityShouldRun:
 *     A function that returns a boolean indicating if reachability tests
 *     should currently run. Can be used to disable tests in certain app states.
 */
const NETINFO_CONFIG = {
  reachabilityUrl: 'https://clients3.google.com/generate_204',
  reachabilityTest: async (r: Response) => r.status === 204,
  reachabilityLongTimeout: 60 * 1000, // 60 seconds
  reachabilityShortTimeout: 5 * 1000, // 5 seconds
  reachabilityRequestTimeout: 15 * 1000, // 15 seconds
  reachabilityShouldRun: () => true,
};

/**
 * Starts monitoring the device’s network connectivity status.
 *
 * Responsibilities:
 * ─────────────────────────────────────────────
 * 1. Configures NetInfo with custom reachability options.
 * 2. Sets up an event listener that updates the global `isConnected` signal
 *    whenever the network status changes.
 * 3. Performs an initial network status fetch to initialize state.
 * 4. Returns a cleanup function to unsubscribe from network status updates.
 *
 * Implementation details:
 * ─────────────────────────────────────────────
 * - The `update` callback receives a `NetInfoState` object whenever connectivity
 *   changes.
 * - Updates `isConnected.value` to:
 *     • `true` if internet is reachable,
 *     • `false` if not reachable,
 *     • `null` if unknown.
 * - Several other signals (commented out) can be added to track connection type,
 *   network details, and timestamps if desired.
 * - Uses `NetInfo.fetch()` to get the current connectivity state immediately
 *   when monitoring starts.
 * - Listens continuously using `NetInfo.addEventListener`.
 *
 * Usage:
 * ─────────────────────────────────────────────
 * ```ts
 * const stopMonitoring = startNetworkMonitoring();
 * // Later, to stop:
 * stopMonitoring();
 * ```
 */
export function startNetworkMonitoring() {
  // Apply the custom NetInfo configuration
  NetInfo.configure(NETINFO_CONFIG);

  // Callback to run on each connectivity change event
  const update = (state: NetInfoState) => {
    // TODO: Consider changing isConnected from boolean to object
    // to hold more detailed network info if needed.
    isConnected.value = state.isInternetReachable ?? null;

    // Uncomment and implement these if you want to track more info:
    // connectionType.value = state.type ?? 'unknown';
    // isInternetReachable.value = state.isInternetReachable ?? null;
    // networkDetails.value = state.details ?? null;
    // lastUpdatedAt.value = Date.now();
  };

  // Perform an initial fetch to set the initial connectivity state
  NetInfo.fetch()
    .then(update)
    .catch(() => {
      // Ignore fetch errors here — connectivity may just be unknown at startup
    });

  // Subscribe to ongoing network status updates
  const unsubscribe = NetInfo.addEventListener(update);

  // Return the unsubscribe function so caller can stop monitoring when needed
  return () => unsubscribe();
}
