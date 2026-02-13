import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { router } from 'expo-router';

const notificationService = {
  registerForPushNotifications: async (userId) => {
    if (!Device.isDevice) {
      console.log('⚠️ Not a physical device, skipping notification registration');
      return null;
    }
    
    if (!userId) {
      console.warn('⚠️ User ID required to register notifications');
      return null;
    }
    
    try {
      console.log('📱 Checking notification permissions...');
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      console.log('Current permission status:', existingStatus);
      
      if (existingStatus !== 'granted') {
        console.log('🔐 Requesting notification permissions...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('New permission status:', status);
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ Notification permission denied');
        return null;
      }
      
      console.log('✅ Getting Expo push token...');
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      
      console.log('✅ Expo push token obtained:', token.data);
      
      // Return token - backend will store it via patchUserData
      return token.data;
    } catch (error) {
      console.error('❌ Error registering notifications:', error);
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
          router.push('/');
        }
      }, 100);
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