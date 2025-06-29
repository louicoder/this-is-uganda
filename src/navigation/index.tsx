import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabsNavigator from './BottomTabsNavigator';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isDarkMode } = useTheme();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Main" component={BottomTabsNavigator} />
    </RootStack.Navigator>
  );
};

export default function App () {
  const { isDarkMode } = useTheme();
  // return (
  //   <SafeAreaProvider style={{ flex: 1, backgroundColor: isDarkMode ? 'black' : 'white' }}>
  //     <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? 'black' : 'white' }} edges={['top', 'bottom']}>
  //       <NavigationContainer>
  //         <RootNavigator />
  //       </NavigationContainer>
  //     </SafeAreaView>
  //   </SafeAreaProvider>
  // );

  return (

    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
