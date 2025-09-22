import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import React from 'react';

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name="(transport)" 
        options={{ 
          title: 'Transport', 
          headerBackVisible: false 
        }} 
      />
      <Stack.Screen 
        name="(hostels)" 
        options={{ 
          title: 'Acoommodation', 
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
