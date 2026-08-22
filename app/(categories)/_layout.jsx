import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import React from 'react';

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(transport)"
        options={{
          // The transport stack draws its own headers per screen, so the
          // parent's would sit on top of them as a second bar.
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="(hostels)" 
        options={{ 
          title: 'Accommodation', 
          headerBackVisible: false 
        }} 
      />
      <Stack.Screen 
        name="(shop)" 
        options={{ 
          title: 'Shop', 
          headerBackVisible: false ,
          headerShown: false
        }} 
      />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
