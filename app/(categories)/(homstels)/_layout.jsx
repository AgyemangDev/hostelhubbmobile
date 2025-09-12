import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#610b0c',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  );
}
