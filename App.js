import React, { useState, useEffect } from 'react';
import { StatusBar, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import icons
import AsyncStorage from '@react-native-async-storage/async-storage';
import Favorite from './screens/Missions';
import Notifications from './screens/notification';
import Profile from './screens/profile';
import Post from './screens/Appointments';
import Login from './screens/Login';  // Import your Login screen

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if token exists in AsyncStorage on app load
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token'); // Fetch token from AsyncStorage
      if (token) {
        setIsLoggedIn(true);  // User is logged in if token exists
      }
    };
    
    checkLoginStatus();  // Run the check when the app loads
  }, []);

  // Handle login event
  const handleLogin = () => {
    setIsLoggedIn(true);  // Update state on successful login
  };

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="red" barStyle="yellow" />
      {isLoggedIn ? (
        // Display the tab navigator if logged in
        <Tab.Navigator>
          <Tab.Screen
            name="Notifications"
            component={Notifications}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="bell" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Missions"
            component={Favorite}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="message" color={color} size={size} />
              ),
            }}
          />
         
          <Tab.Screen
            name="Posts"
            component={Post}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="account-star-outline"
                  color={color}
                  size={size}
                />
              ),
              tabBarLabel: 'appointments', // Remove title for this tab
            }}
          />
           <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="account"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        // Show the login screen if not logged in
        <Login onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}
