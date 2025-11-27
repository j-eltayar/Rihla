import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserInfoContext } from './contexts/UserInfoContext';
import Login from './screens/Login';
import Landing from './screens/Landing';
import List from './screens/List';
import Profile from './screens/Profile';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function MainTabs({ route, navigation }) {
  const { userInfo } = route.params || {};

  return (
    <UserInfoContext.Provider value={userInfo}>
      <Tab.Navigator
        tabBarPosition="bottom"
        screenOptions={{
          tabBarShowLabel: false,
          tabBarIndicatorStyle: { 
            backgroundColor: '#A2C0B0',
            height: 3,
          },
          tabBarStyle: {
            backgroundColor: '#fffff0',
            borderTopWidth: 1,
            borderTopColor: '#ddd',
          },
          tabBarActiveTintColor: '#A2C0B0',
          tabBarInactiveTintColor: 'gray',
          tabBarIcon: ({ focused, color }) => {
            const routeName = navigation.getState().routes[navigation.getState().index].name;
            let iconName;

            if (routeName === 'Landing') {
              iconName = focused ? 'location' : 'location-outline';
            } else if (routeName === 'List') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (routeName === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={24} color={color} />;
          },
        }}
        swipeEnabled={true}
        sceneContainerStyle={{ backgroundColor: 'transparent' }}
        style={{ backgroundColor: 'transparent' }}
      >
        <Tab.Screen 
          name="Landing"
          component={Landing}
          initialParams={{ userInfo }}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'location' : 'location-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="List"
          component={List}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'list' : 'list-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Profile"
          component={Profile}
          initialParams={{ userInfo }}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </UserInfoContext.Provider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            gestureEnabled: false, // Disable swipe back gesture
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={Login}
            options={{
              gestureEnabled: true, // Allow swipe on login screen only
            }}
          />
          <Stack.Screen 
            name="Main" 
            component={MainTabs}
            options={{
              gestureEnabled: false, // Prevent swipe back to login
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
