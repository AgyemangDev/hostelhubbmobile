import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import React from 'react';

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name="(guesthouses)" 
        options={{ 
          title: 'Guest Houses', 
          headerBackVisible: false 
        }} 
      />
      <Stack.Screen 
        name="(hotels)" 
        options={{ 
          title: 'Hotels', 
          headerBackVisible: false 
        }} 
      />
      <Stack.Screen 
        name="(hostels)" 
        options={{ 
          title: 'Hostels', 
          headerBackVisible: false 
        }} 
      />
      <Stack.Screen 
        name="(homstels)" 
        options={{ 
          title: 'Homestel', 
          headerBackVisible: false 
        }} 
      />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
