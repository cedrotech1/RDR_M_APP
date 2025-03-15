import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from 'react-native-vector-icons';
import Mission from './screens/Mission';
import Notifications from './screens/notification';
import Profile from './screens/profile';
import Appoitments from './screens/Appoitments';
import Login from './screens/Login';


const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);  // Update state on successful login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="green" barStyle="light-content" />
      <Tab.Navigator>
        {isLoggedIn ? (
          <>

            <Tab.Screen
              name="Mission"
              component={Mission}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="map-marker" color={color} size={size} />
                ),
                headerShown: false, // Hide header for this screen
              }}
            />
            <Tab.Screen
              name="Appoitment"
              component={Appoitments}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="calendar-check" color={color} size={size} />
                ),
                tabBarLabel: 'Appoitment',
                headerShown: false, // Hide header for this screen
              }}
            />
            <Tab.Screen
              name="Notifications"
              component={Notifications}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="bell-outline" color={color} size={size} />
                ),
                headerShown: false, // Hide header for this screen
              }}
            />
            <Tab.Screen
              name="Profile"
              component={Profile}
              initialParams={{ onLogout: handleLogout }}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
                ),
                headerShown: false, // Hide header for this screen
              }}
            />
          </>
        ) : (
          <>
            <Tab.Screen
              name="Login"
              component={Login}
              initialParams={{ onLogin: handleLogin }}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="log-in-outline" size={size} color={color} />
                ),
                headerShown: false, // Hide header for this screen
                tabBarStyle: { display: 'none' }, // Hide the tab on the tab bar
              }}
            />


          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
