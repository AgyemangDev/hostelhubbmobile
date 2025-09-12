import { StyleSheet } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { AntDesign, Ionicons, Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Layout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#610B0C',
          tabBarStyle: {
            backgroundColor: '#ffff',
          },
        }}
      >
        {/* Explore Tab */}
        <Tabs.Screen
          name="(index)"
          options={{
            title: 'Explore',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="earth-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Agents Tab */}
        <Tabs.Screen
          name="(agent)"
          options={{
            title: 'HubbClips',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Octicons name="video" size={size} color={color} />
            ),
          }}
        />

        {/* Maps Tab */}
        <Tabs.Screen
          name="map"
          options={{
            title: 'Maps',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="compass" size={size} color={color} />
            ),
          }}
        />

        {/* Bookings Tab */}
        <Tabs.Screen
          name="(bookings)"
          options={{
            title: 'Bookings',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Profile Tab */}
        <Tabs.Screen
          name="(ProfileScreens)"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default Layout;

const styles = StyleSheet.create({});
