// networkManager.ts
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { isConnected } from '@/signals/global';

// optional: tune these for your app / region
const NETINFO_CONFIG = {
  reachabilityUrl: 'https://clients3.google.com/generate_204',
  reachabilityTest: async (r: Response) => r.status === 204,
  reachabilityLongTimeout: 60 * 1000,
  reachabilityShortTimeout: 5 * 1000,
  reachabilityRequestTimeout: 15 * 1000,
  reachabilityShouldRun: () => true,
};

export function startNetworkMonitoring() {
  NetInfo.configure(NETINFO_CONFIG);
  const update = (state: NetInfoState) => {
    // TODO: maybe change connection to an object instead of a boolean
    isConnected.value = state.isInternetReachable ?? null;
    // connectionType.value = state.type ?? 'unknown';
    // isInternetReachable.value = state.isInternetReachable ?? null;
    // networkDetails.value = state.details ?? null;
    // lastUpdatedAt.value = Date.now();
  };
  // get initial snapshot
  NetInfo.fetch()
    .then(update)
    .catch(() => {
      /* ignore */
    });
  const unsubscribe = NetInfo.addEventListener(update);
  return () => unsubscribe();
}
