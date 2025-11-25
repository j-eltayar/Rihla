import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Login from './screens/Login';
import Landing from './screens/Landing';
import List from './screens/List';
import Profile from './screens/Profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ route }) {
  const { userInfo } = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Landing') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'List') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#A2C0B0',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fffff0',
          borderTopColor: '#ddd',
        },
      })}
    >
      <Tab.Screen 
        name="Landing" 
        component={Landing}
        initialParams={{ userInfo }}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="List" 
        component={List}
        options={{ tabBarLabel: 'List' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        initialParams={{ userInfo }}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
