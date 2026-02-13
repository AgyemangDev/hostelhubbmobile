import { useState, useEffect, useContext } from "react";
import { Alert, Linking, Platform } from "react-native";
import * as Notifications from 'expo-notifications';
import { UserContext } from "../../context/UserContext";
import notificationService from "../../app/firebase/notificationService";

/**
 * Custom hook to handle notification permissions
 */
export const useNotificationPermission = () => {
  const { user, userInfo, patchUserData } = useContext(UserContext);
  const [currentExpoToken, setCurrentExpoToken] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(null); // 'granted', 'denied', 'undetermined'

  // Check permission status
  useEffect(() => {
    const checkPermissionStatus = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
    };
    checkPermissionStatus();
  }, []);

  // Fetch current Expo token on mount
  useEffect(() => {
    const fetchExpoToken = async () => {
      if (!user) return;
      try {
        const token = await notificationService.registerForPushNotifications(user.uid);
        setCurrentExpoToken(token);
        
        // Update permission status after token fetch
        const { status } = await Notifications.getPermissionsAsync();
        setPermissionStatus(status);
      } catch (err) {
        console.error("❌ Failed to get Expo token:", err);
      }
    };
    fetchExpoToken();
  }, [user]);

  // Check if notifications are enabled
  useEffect(() => {
    if (userInfo?.expo_token && currentExpoToken) {
      setNotificationsEnabled(userInfo.expo_token === currentExpoToken);
    } else {
      setNotificationsEnabled(false);
    }
  }, [userInfo, currentExpoToken]);

  // Open app settings
  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  // Request permission and patch DB
  const requestNotificationPermission = async ({
    title = "Enable Notifications",
    message = "Turn on notifications to receive important updates.",
    onSuccess,
    onCancel,
  } = {}) => {
    return new Promise(async (resolve) => {
      if (notificationsEnabled) {
        if (onSuccess) onSuccess();
        resolve(true);
        return;
      }

      // Check current permission status
      const { status: currentStatus } = await Notifications.getPermissionsAsync();
      
      // If permission was previously denied, prompt to open settings
      if (currentStatus === 'denied') {
        Alert.alert(
          "Notifications Disabled",
          "You have disabled notifications for this app. To enable them, please go to Settings and turn on notifications.",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                if (onCancel) onCancel();
                resolve(false);
              },
            },
            {
              text: "Open Settings",
              onPress: () => {
                openAppSettings();
                if (onCancel) onCancel();
                resolve(false);
              },
            },
          ]
        );
        return;
      }

      // Otherwise, show enable prompt
      Alert.alert(
        title,
        message,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              if (onCancel) onCancel();
              resolve(false);
            },
          },
          {
            text: "Enable",
            onPress: async () => {
              setIsRequesting(true);
              try {
                // Request permission
                const token = await notificationService.registerForPushNotifications(user.uid);
                
                if (!token) {
                  // Permission denied - offer to open settings
                  Alert.alert(
                    "Permission Denied",
                    "Notifications are disabled. Would you like to enable them in Settings?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { 
                        text: "Open Settings", 
                        onPress: openAppSettings 
                      }
                    ]
                  );
                  resolve(false);
                  return;
                }

                // Update token in backend
                await patchUserData({
                  expo_token: token,
                  last_interacted: new Date().toISOString(),
                });

                setCurrentExpoToken(token);
                setNotificationsEnabled(true);
                setPermissionStatus('granted');

                if (onSuccess) onSuccess();
                resolve(true);
              } catch (err) {
                console.error("Failed to enable notifications:", err);
                Alert.alert("Error", "Failed to enable notifications. Please try again.");
                if (onCancel) onCancel();
                resolve(false);
              } finally {
                setIsRequesting(false);
              }
            },
          },
        ]
      );
    });
  };

  const ensureNotificationsEnabled = async (options = {}) => {
    if (notificationsEnabled) return true;
    return await requestNotificationPermission(options);
  };

  return {
    notificationsEnabled,
    currentExpoToken,
    isRequesting,
    permissionStatus, // 'granted', 'denied', 'undetermined'
    requestNotificationPermission,
    ensureNotificationsEnabled,
    openAppSettings, // Export this for direct use
  };
};