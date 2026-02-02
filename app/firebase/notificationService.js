import * as Notifications from 'expo-notifications';
import { supabase } from './supabaseConfig';
import { Alert, Linking, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { router } from 'expo-router';

const notificationService = {
  // Check if user has notification token stored
  checkUserHasToken: async (userId) => {
    if (!userId) return false;
    
    try {
      const { data, error } = await supabase
        .from('Student_Users')
        .select('expo_token')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return !!data?.expo_token;
    } catch (error) {
      console.error('Error checking token:', error);
      return false;
    }
  },

  // Register for push notifications and store token
  registerForPushNotifications: async (userId) => {
    if (!Device.isDevice) {
      return null;
    }
    
    if (!userId) {
      console.warn('User ID required to register notifications');
      return null;
    }
    
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        return null;
      }
      
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      
      // Store token in Supabase
      const { error } = await supabase
        .from('Student_Users')
        .update({ expo_token: token.data })
        .eq('id', userId);
      
      if (error) throw error;
      
      return token.data;
    } catch (error) {
      console.error('Error registering notifications:', error);
      return null;
    }
  },

  // Show prompt to enable notifications
  promptForNotifications: (onEnable) => {
    Alert.alert(
      '🔔 Enable Notifications',
      'Stay updated with booking confirmations, special offers, and important updates. Enable notifications now?',
      [
        {
          text: 'Later',
          style: 'cancel',
        },
        {
          text: 'Enable',
          onPress: onEnable,
        },
      ]
    );
  },

  // Safe navigation handler with error catching
  handleNotificationNavigation: (data) => {
    if (!data || !data.type) {
      console.warn('No navigation data in notification');
      return;
    }

    try {
      console.log('Handling notification navigation:', data);

      // Add a small delay to ensure app is fully loaded
      setTimeout(() => {
        try {
          switch (data.type) {
            case 'booking_cancelled':
            case 'booking_successful':
            case 'booking_accepted':
              if (data.bookingId) {
                router.push(`/(bookings)/${data.bookingId}`);
              } else {
                console.warn('No bookingId in notification data');
                router.push('/');
              }
              break;

            case 'hostel_advertisement':
              if (data.hostelId) {
                router.push({
                  pathname: "/(Details)/[id]",
                  params: { id: data.hostelId }
                });
              } else {
                console.warn('No hostelId in notification data');
                router.push('/');
              }
              break;

            case 'notifications':
              router.push('/NotificationScreen');
              break;

            default:
              console.warn('Unknown notification type:', data.type);
              router.push('/');
          }
        } catch (navError) {
          console.error('Navigation error:', navError);
          // Fallback to home if navigation fails
          router.push('/');
        }
      }, 100); // Small delay for iOS stability
    } catch (error) {
      console.error('Error in handleNotificationNavigation:', error);
    }
  },
  
  // Set up notification handlers
  listenToNotifications: () => {
    // Configure notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    
    // Handle notifications received while app is in foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      try {
        console.log('Notification received in foreground:', notification);
        
        Toast.show({
          type: 'success',
          position: 'top',
          text1: notification.request.content.title || 'New notification',
          text2: notification.request.content.body || '',
          visibilityTime: 4000,
          autoHide: true,
        });
      } catch (error) {
        console.error('Error handling foreground notification:', error);
      }
    });
    
    // Handle notification taps
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      try {
        console.log('Notification tapped:', response);
        
        const data = response.notification.request.content.data;
        notificationService.handleNotificationNavigation(data);
      } catch (error) {
        console.error('Error handling notification tap:', error);
        // Fallback to home on error
        setTimeout(() => {
          try {
            router.push('/');
          } catch (navError) {
            console.error('Fallback navigation failed:', navError);
          }
        }, 100);
      }
    });
    
    return () => {
      try {
        foregroundSubscription.remove();
        responseSubscription.remove();
      } catch (error) {
        console.error('Error removing notification listeners:', error);
      }
    };
  },
  
  // Reset badge count
  resetBadgeCount: async () => {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Error resetting badge count:', error);
    }
  },
};

export default notificationService;