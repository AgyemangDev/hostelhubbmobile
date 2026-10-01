import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { WhatsAppButton } from '../../components/ButtonComponents/WhatsAppButton';

const Layout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#0F6E56',
          tabBarStyle: {
            backgroundColor: '#ffff',
          },
          gestureEnabled: false,
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
          name="(Hubclipps)"
          options={{
            title: 'Hubclipps',
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

      <View style={styles.fab} pointerEvents="box-none">
        <WhatsAppButton size={60} />
      </View>
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 0,
    zIndex: 999,
  },
});