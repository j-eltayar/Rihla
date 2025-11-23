import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Hide the header for a cleaner look
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        {/* Add more screens here later, e.g., Home, Profile, etc. */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
