import { AppRegistry, StatusBar } from 'react-native';
import Application from '@/navigation/index';
// import Application from './App';
import { name as appName } from './app.json';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import RadioPlayer from '@/components/RadioPlayer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioPro, AudioProContentType } from 'react-native-audio-pro';
import { MMKV_STORAGE } from '@/constants';
import { radio_stations } from '@/signals/radio';
import { startNetworkMonitoring } from '@/helpers/networkManager';
import { useSignals } from '@preact/signals-react/runtime';
import { initAppLifecycleManager } from '@/helpers/appLifecycleManager';

// This helper function helps monitor network status
// and updates relevant signals when the status changes
// It's also outside the react tree to limit re-renders.
startNetworkMonitoring();

// Let's init the app life cycle handler here to listen
// to when the app goes to background and when it becomes active again.
initAppLifecycleManager()

const App = () => {
  useSignals();
  // useSignals should always be put at the first line of every component
  // that is using signals in order to recieve updates.
  const { isDarkMode } = useTheme();

  // This useEffect helps monitor the theme change and toggles the content
  // to be either dark when the theme is light or light when the theme is dark.
  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
  }, [isDarkMode]);

  useEffect(() => {
    const stations = MMKV_STORAGE.getString('STATIONS') ?? [];
    radio_stations.value = stations?.length ? JSON.parse(stations) : [];
  }, []);

  // We now wrap our app before with GestureHandlerRootView is order to be able to
  // use gestures in the application.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <Application />
        <RadioPlayer />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent(appName, () => App);

// Let's prepare the audio player outside of the react life cycle,
// this is to enable it to play even when the app is killed.
AudioPro.configure({
  contentType: AudioProContentType.MUSIC,
  debug: __DEV__,
});

// Set up event listeners that persist for the app's lifetime
// AudioPro.addEventListener((event) => {
//     // console.log('EVENT', event)
//     switch (event.type) {
//       // case AudioProEventType.TRACK_ENDED:
//       //   // Auto-play next track when current track ends
//       //   const nextTrack = determineNextTrack();
//       //   if (nextTrack) {
//       //     AudioPro.play(nextTrack);
//       //   }
//       //   break;

//       // case AudioProEventType.REMOTE_NEXT:
//       //   // Handle next button press from lock screen/notification
//       //   const nextTrackFromRemote = determineNextTrack();
//       //   AudioPro.play(nextTrackFromRemote);
//       //   break;
//       case AudioProEventType.STATE_CHANGED:
//         console.log('CHANGED STATE', event)
//         // if(event.payload?.state === [AudioProState.PAUSED, AudioProState.])
//         break;
//     }
//   });
