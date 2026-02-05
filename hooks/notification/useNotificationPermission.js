import { useState, useEffect, useContext } from "react";
import { Alert } from "react-native";
import { UserContext } from "../../context/UserContext";
import notificationService from "../../app/firebase/notificationService";

/**
 * Custom hook to handle notification permissions
 */
export const useNotificationPermission = () => {
  const { user, userInfo, patchUserData, setUserInfo } = useContext(UserContext);
  const [currentExpoToken, setCurrentExpoToken] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  // Fetch current Expo token on mount
  useEffect(() => {
    const fetchExpoToken = async () => {
      if (!user) return;
      try {
        const token = await notificationService.registerForPushNotifications(user.uid);
        setCurrentExpoToken(token);
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

  // Request permission and patch DB
  const requestNotificationPermission = async ({
    title = "Enable Notifications",
    message = "Turn on notifications to receive important updates.",
    onSuccess,
    onCancel,
  } = {}) => {
    return new Promise((resolve) => {
      if (notificationsEnabled) {
        if (onSuccess) onSuccess();
        resolve(true);
        return;
      }

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
                if (!currentExpoToken) {
                  Alert.alert(
                    "Notifications Required",
                    "Please allow notifications in your device settings."
                  );
                  resolve(false);
                  return;
                }

                await patchUserData({
                  expo_token: currentExpoToken,
                  last_interacted: new Date().toISOString(),
                });

                // Update context immediately
                if (setUserInfo) setUserInfo((prev) => ({ ...prev, expo_token: currentExpoToken }));

                setNotificationsEnabled(true);

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
    requestNotificationPermission,
    ensureNotificationsEnabled,
  };
};