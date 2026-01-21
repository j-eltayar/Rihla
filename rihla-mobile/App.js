import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppDataProvider } from './contexts/UserInfoContext';
import Login from './screens/Login';
import Landing from './screens/Landing';
import List from './screens/List';
import Locations from './screens/Locations';
import Profile from './screens/Profile';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const ListStack = createNativeStackNavigator();

function ListStackNavigator() {
  return (
    <ListStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      <ListStack.Screen 
        name="ListMain" 
        component={List}
      />
      <ListStack.Screen 
        name="Locations" 
        component={Locations}
        options={{
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      />
    </ListStack.Navigator>
  );
}

function MainTabs({ route, navigation }) {
  const { userInfo } = route.params || {};

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
        screenOptions={{
          tabBarShowLabel: false,
          tabBarIndicatorStyle: { 
            backgroundColor: 'transparent',
            height: 0,
          },
          tabBarStyle: {
            backgroundColor: '#fffff0',
            borderTopWidth: 0.5,
            borderTopColor: '#e0e0e0',
            height: 85,
            paddingBottom: 30,
            paddingTop: 5,
            elevation: 0,
            shadowOpacity: 0,
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

            return <Ionicons name={iconName} size={26} color={color} />;
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
              <Ionicons name={focused ? 'location' : 'location-outline'} size={26} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="List"
          component={ListStackNavigator}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'list' : 'list-outline'} size={26} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Profile"
          component={Profile}
          initialParams={{ userInfo }}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={26} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
  );
}

export default function App() {
  const [userInfo, setUserInfo] = React.useState(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppDataProvider initialUserInfo={userInfo}>
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
      </AppDataProvider>
    </GestureHandlerRootView>
  );
}
