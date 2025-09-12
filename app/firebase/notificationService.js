import * as Notifications from 'expo-notifications';
import { auth, db } from '../firebase/FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Alert, Linking, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';

const notificationService = {
  // This will store the token when it's generated
  _expoPushToken: null,
  
  // Initialize auth listener to update token when auth state changes
  initAuthListener: () => {
    console.log('📱 Setting up auth state listener for token management...');
    
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('👤 User logged in, checking if token needs to be stored:', user.uid);
        
        // If we already have the token cached, store it now that user is logged in
        if (notificationService._expoPushToken) {
          await notificationService.storeTokenInFirestore(notificationService._expoPushToken, user.uid);
        } else {
          // If no token yet, try to get it and store it
          console.log('🔄 No token cached, attempting to register again now that user is logged in');
          notificationService.registerForPushNotifications();
        }
      } else {
        console.log('👤 User logged out, token will be stored on next login');
      }
    });
  },
  
  // Store token in Firestore (separate function for reuse)
  storeTokenInFirestore: async (tokenData, userId) => {
    try {
      console.log('💾 Storing token in Firestore for user:', userId);
      console.log('💾 Token data:', tokenData);
      
      const userRef = doc(db, 'Student_Users', userId);
      const userDoc = await getDoc(userRef);
     
      // Only update if token is different or doesn't exist
      if (!userDoc.exists() || userDoc.data().expoPushToken !== tokenData) {
        await setDoc(userRef, { expoPushToken: tokenData }, { merge: true });
        console.log('✅ Push token stored/updated in Firestore for user:', userId);
        return true;
      } else {
        console.log('✅ Token already up to date in Firestore');
        return false;
      }
    } catch (error) {
      console.error('❌ Error storing token in Firestore:', error);
      return false;
    }
  },
  
  registerForPushNotifications: async () => {
    let token;
    
    if (!Device.isDevice) {
      console.log('📱 Must use physical device for push notifications - simulator/emulator not supported');
      return null;
    }
    
    try {
      // Check if the app has notification permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('📱 Current notification permission status:', existingStatus);
      
      let finalStatus = existingStatus;
      
      // If no permission, request it
      if (existingStatus !== 'granted') {
        console.log('📱 Requesting notification permissions...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('📱 New notification permission status:', finalStatus);
      }
      
      // If still no permission after requesting, handle accordingly
      if (finalStatus !== 'granted') {
        console.log('❌ Permission denied for push notifications.');
        // Handle prompting user to enable notifications manually
        if (finalStatus === 'denied') {
          // Show a custom alert asking the user if they want to enable notifications
          Alert.alert(
            'Enable Push Notifications',
            'Push notifications are disabled. Would you like to enable them to receive updates?',
            [
              {
                text: 'No, Thanks',
                onPress: () => console.log('User declined to enable notifications'),
                style: 'cancel',
              },
              {
                text: 'Go to Settings',
                onPress: () => {
                  // Open app settings to enable push notifications manually
                  Linking.openSettings();
                },
              },
            ],
            { cancelable: true }
          );
        }
        return null;
      }
      
      // Get the token
      console.log('📱 Getting Expo push token...');
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      
      console.log('📱 Expo push token retrieved:', token.data);
      
      // Cache the token for later use (when user logs in)
      notificationService._expoPushToken = token.data;
      
      // Try to store token if user is already logged in
      const user = auth.currentUser;
      if (user) {
        console.log('👤 User is logged in, storing token for user:', user.uid);
        await notificationService.storeTokenInFirestore(token.data, user.uid);
      } else {
        console.log('❌ User not logged in, token is cached and will be stored when user logs in');
      }
      
      return token.data;
    } catch (error) {
      console.error('❌ Error registering for push notifications:', error);
      return null;
    }
  },
  
  listenToNotifications: () => {
    console.log('📱 Setting up notification handlers and listeners...');
    
    // Configure notification handler (only set once)
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        console.log('📱 Handling incoming notification...');
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        };
      },
    });
    
    // Handle notifications when received in the foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 Notification received in foreground: ', JSON.stringify(notification, null, 2));
      // Show toast message when the app is open
      Toast.show({
        type: 'success',
        position: 'top',
        text1: notification.request.content.title || 'New notification',
        text2: notification.request.content.body || '',
        visibilityTime: 4000,
        autoHide: true,
      });
    });
    
    // Handle response to notifications when clicked
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('📱 Notification response received: ', JSON.stringify(response, null, 2));
      
      const data = response.notification.request.content.data;
      
      if (data && data.type) {
        console.log(`📱 Processing ${data.type} notification with data:`, data);
    
        switch (data.type) {
          case 'booking_cancelled':
            // Navigate to booking details page with bookingId (or hostelId)
            router.push(`/(bookings)/${data.bookingId}`);
            break;
          case 'booking_successful':
            router.push(`/(bookings)/${data.bookingId}`);
            break;
          case 'booking_accepted':
            router.push(`/(bookings)/${data.bookingId}`);
            break;
          case 'hostel_advertisement':
            router.push({
              pathname: "/(Details)/[id]",
              params: { hostelId: data.hostelId }
            });
            break;
          case 'notifications':
            router.push('/NotificationScreen');
            break;
          default:
            router.push('/'); 
        }
      }
    });
    
    console.log('✅ Notification listeners set up successfully');
    
    // Return unsubscribe function for cleanup
    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  },
  
  // Reset the app badge count
  resetBadgeCount: async () => {
    try {
      await Notifications.setBadgeCountAsync(0);
      console.log('✅ Badge count reset to 0');
    } catch (error) {
      console.error('❌ Error resetting badge count:', error);
    }
  },
  
  // Listen for token changes and update stored value
  listenForTokenChanges: () => {
    console.log('📱 Setting up push token change listener...');
    
    const subscription = Notifications.addPushTokenListener(async token => {
      console.log('📱 Push token changed:', token);
      
      // Update cached token
      notificationService._expoPushToken = token.data;
      
      // Try to update in Firestore if user is logged in
      const user = auth.currentUser;
      if (user) {
        await notificationService.storeTokenInFirestore(token.data, user.uid);
      } else {
        console.log('❌ User not logged in, updated token will be stored when user logs in');
      }
    });
    
    return subscription;
  },
  
  // Send a local notification (useful for testing)
  sendLocalNotification: async (title, body, data = {}) => {
    try {
      console.log('📱 Scheduling local notification:', { title, body, data });
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          badge: 1,
          sound: true,
        },
        trigger: null, // Send immediately
      });
      
      console.log('✅ Local notification scheduled with ID:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Error sending local notification:', error);
      return null;
    }
  },
  
  // Test function to verify the current stored token
  verifyStoredToken: async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ No user logged in to verify token');
      return { loggedIn: false };
    }
    
    try {
      const userRef = doc(db, 'Student_Users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists() && userDoc.data().expoPushToken) {
        console.log('✅ Stored token found:', userDoc.data().expoPushToken);
        
        // Compare with current token
        const currentToken = notificationService._expoPushToken;
        const storedToken = userDoc.data().expoPushToken;
        const tokensMatch = currentToken === storedToken;
        
        console.log('✅ Current token:', currentToken);
        console.log('✅ Stored token:', storedToken);
        console.log('✅ Tokens match:', tokensMatch);
        
        return {
          loggedIn: true,
          hasToken: true,
          storedToken,
          currentToken,
          tokensMatch
        };
      } else {
        console.log('❌ No token stored for user:', user.uid);
        return { loggedIn: true, hasToken: false };
      }
    } catch (error) {
      console.error('❌ Error verifying stored token:', error);
      return { loggedIn: true, hasToken: false, error: error.message };
    }
  }
};

export default notificationService;