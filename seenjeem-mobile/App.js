import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import TeamSetupScreen from './screens/TeamSetupScreen';
import CategoryScreen from './screens/CategoryScreen';
import QuizScreen from './screens/QuizScreen';
import ScoreScreen from './screens/ScoreScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            animationEnabled: true,
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="TeamSetup" component={TeamSetupScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Score" component={ScoreScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
