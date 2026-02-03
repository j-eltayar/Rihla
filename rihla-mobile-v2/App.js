import React, { useEffect, useCallback, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { ProgressProvider } from './contexts/ProgressContext';
import { MusicProvider } from './contexts/MusicContext';
import LandingScreen from './screens/LandingScreen';
import RaniaMenuScreen from './screens/RaniaMenuScreen';
import JamesMenuScreen from './screens/JamesMenuScreen';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import MessagesScreen from './screens/MessagesScreen';
import NotesScreen from './screens/NotesScreen';
import RemindersScreen from './screens/RemindersScreen';
import CFAPrepScreen from './screens/CFAPrepScreen';
import YourFaultsScreen from './screens/YourFaultsScreen';
import HardDayScreen from './screens/HardDayScreen';
import MoroccoScreen from './screens/MoroccoScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep splash screen visible for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <MusicProvider>
        <ProgressProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Landing"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen name="RaniaMenu" component={RaniaMenuScreen} />
              <Stack.Screen name="JamesMenu" component={JamesMenuScreen} />
              <Stack.Screen name="WhyILoveYou" component={HomeScreen} />
              <Stack.Screen name="Detail" component={DetailScreen} />
              <Stack.Screen name="Messages" component={MessagesScreen} />
              <Stack.Screen name="CFAPrep" component={CFAPrepScreen} />
              <Stack.Screen name="YourFaults" component={YourFaultsScreen} />
              <Stack.Screen name="HardDay" component={HardDayScreen} />
              <Stack.Screen name="Morocco" component={MoroccoScreen} />
              <Stack.Screen name="Notes" component={NotesScreen} />
              <Stack.Screen name="Reminders" component={RemindersScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ProgressProvider>
      </MusicProvider>
    </View>
  );
}
