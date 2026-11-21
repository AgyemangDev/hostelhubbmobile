import { StyleSheet, View } from 'react-native';
import { Tabs, useSegments } from 'expo-router';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { WhatsAppButton } from '../../components/buttons/support/WhatsAppButton';
import { colors } from "../../constants/theme";

const Layout = () => {
  // The floating WhatsApp button is hidden everywhere in Hubclips (feed and
  // posting screens): it covers the video and the clip's own actions.
  const segments = useSegments();
  const inHubclips = segments.includes('(Hubclipps)');
  // The map has its own floating controls and preview card in that corner.
  const onMap = segments.includes('map');
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.brand,
          tabBarStyle: {
            backgroundColor: colors.surface,
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

      {inHubclips || onMap ? null : (
        <View style={styles.fab} pointerEvents="box-none">
          <WhatsAppButton size={60} />
        </View>
      )}
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