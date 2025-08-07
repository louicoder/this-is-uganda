import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from '@/screens/home/index';
import { HomeIcon, Binoculars, UserRound, Search, AudioWaveform } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import Radios from '@/components/Radios';
import { useResponsiveFontSize } from '@/hooks/useResponsiveScreen';
const Tab = createBottomTabNavigator();

const SearchScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Search!</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile!</Text>
  </View>
);

const DestinationScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Destination!</Text>
  </View>
);

const Comp = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 20 }}>{name}</Text>
  </View>
);

export default function BottomTabsNavigator() {
  const { isDarkMode } = useTheme();
  const { RFVALUE } = useResponsiveFontSize();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: {
          backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
        },

        // headerShown: false,
        tabBarStyle: { backgroundColor: isDarkMode ? 'black' : 'white', height: RFVALUE(50) },

        // animation: 'shift',
        tabBarIcon: ({ color }) => {
          switch (route.name) {
            case 'Home':
              return <HomeIcon color={color} size={22} />;
            case 'Search':
              return <Search color={color} size={22} />;
            case 'Profile':
              return <UserRound color={color} size={22} />;
            case 'Radio':
              return <AudioWaveform color={color} size={22} />;
            case 'Destination':
              return <Binoculars color={color} size={22} />;
          }
        },
        tabBarInactiveTintColor: isDarkMode ? 'white' : 'black',
        tabBarActiveTintColor: isDarkMode ? '#aaa' : 'black',
        tabBarButton: props => (
          <Pressable onPress={props.onPress} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {props.children}
          </Pressable>
        ),
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Radio" component={Radios} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Destination" component={DestinationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
