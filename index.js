

import {AppRegistry} from 'react-native';
// import App from './App';
import App from '@/navigation/index';
import {name as appName} from './app.json';
// import { Toaster } from 'sonner-native';
// import { SafeAreaProvider as Safe } from 'react-native-safe-area-context';
// import 'react-native-gesture-handler';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// const AppContainer = () => (
//   <Safe style={{flex: 1}}>

//     <GestureHandlerRootView>

//     <App />
//     <Toaster />
//     </GestureHandlerRootView>
//   </Safe>
// );
AppRegistry.registerComponent(appName, () => App);
