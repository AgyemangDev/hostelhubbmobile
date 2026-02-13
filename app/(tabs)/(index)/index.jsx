import React, { useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";
import CustomHeader from "../../../components/Headers/CustomHeader";
import HorizontalScrollCardComponent from "../../../components/HomeComponents/HorizontalScrollCardComponent";
import CategoryNavigationCards from "../../../components/HomeComponents/CategoryNavigationCards";
import BenefitSlider from "../../../components/Sliders/BenefitSlider";
import { hostelBenefits } from "../../../assets/data/SlideData";
import { WhatsAppButton } from "../../../components/ButtonComponents/WhatsAppButton";
import StorageBannerSlider from "../../../components/Sliders/StorageBannerSlider";
import notificationService from "../../firebase/notificationService";
import { UserContext } from "../../../context/UserContext";
import NotificationPromptBanner from "../../../components/BannerComponents/Notificationpromptbanner";

const Index = () => {
  const { user, userInfo, patchUserData } = useContext(UserContext);
  const [currentExpoToken, setCurrentExpoToken] = useState(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  // Get the current Expo push token for this device
  useEffect(() => {
    const fetchToken = async () => {
      if (!user) {
        setIsCheckingToken(false);
        return;
      }

      try {
        console.log('🔍 Fetching current device token...');
        const token = await notificationService.registerForPushNotifications(user.uid);
        console.log('📱 Current device token:', token);
        setCurrentExpoToken(token);
      } catch (err) {
        console.error('❌ Failed to get current Expo token:', err);
      } finally {
        setIsCheckingToken(false);
      }
    };

    fetchToken();
  }, [user]);

  // Debug logging
  useEffect(() => {
    if (!isCheckingToken && userInfo) {
      console.log('========================================');
      console.log('BANNER LOGIC CHECK:');
      console.log('User exists:', !!user);
      console.log('UserInfo exists:', !!userInfo);
      console.log('UserInfo.expo_token:', userInfo.expo_token);
      console.log('CurrentExpoToken:', currentExpoToken);
      console.log('Is checking token:', isCheckingToken);
      console.log('========================================');
    }
  }, [user, userInfo, currentExpoToken, isCheckingToken]);

  // Fixed banner logic
  const showNotificationPrompt = React.useMemo(() => {
    // Don't show banner while checking token or if user/userInfo not loaded
    if (!user || !userInfo || isCheckingToken) {
      console.log('❌ Banner hidden: Missing prerequisites');
      return false;
    }

    const storedToken = userInfo.expo_token;
    
    // Show banner if:
    // 1. No token stored in backend
    // 2. Token is literally string "null"
    // 3. Token is empty string
    // 4. Current device token doesn't match stored token
    
    const shouldShow = 
      !storedToken || 
      storedToken === 'null' || 
      storedToken === '' ||
      storedToken === null ||
      (currentExpoToken && storedToken !== currentExpoToken);

    console.log('Banner should show:', shouldShow);
    console.log('Reason:', {
      noToken: !storedToken,
      isStringNull: storedToken === 'null',
      isEmpty: storedToken === '',
      isNull: storedToken === null,
      tokenMismatch: currentExpoToken && storedToken !== currentExpoToken
    });

    return shouldShow;
  }, [user, userInfo, currentExpoToken, isCheckingToken]);

  const handleEnableNotifications = async () => {
    console.log('========================================');
    console.log('🔔 ENABLE NOTIFICATIONS CLICKED');
    console.log('User exists:', !!user);
    console.log('UserInfo:', userInfo);
    
    if (!user) {
      console.log('❌ No user, returning');
      return;
    }

    try {
      console.log('Step 1: Requesting push token...');
      const expoToken = await notificationService.registerForPushNotifications(user.uid);
      console.log('📱 Expo token received:', expoToken);
      
      if (!expoToken) {
        console.log('❌ No expo token received, returning');
        return;
      }

      console.log('Step 2: Calling patchUserData to save token...');
      await patchUserData({
        expo_token: expoToken,
        last_interacted: new Date().toISOString(),
      });

      // Update local state to hide banner immediately
      setCurrentExpoToken(expoToken);
      
      console.log('✅ Notification update completed successfully');
      console.log('========================================');
    } catch (err) {
      console.error('❌ Failed to enable notifications:', err);
      console.log('========================================');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.headerWrapper}>
          <CustomHeader />
        </View>

        {showNotificationPrompt && (
          <NotificationPromptBanner
            onEnable={handleEnableNotifications}
          />
        )}

        <CategoryNavigationCards />
        <StorageBannerSlider />
        <HorizontalScrollCardComponent />
        <BenefitSlider benefits={hostelBenefits} />
      </ScrollView>

      <WhatsAppButton size={60} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 10
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
});

export default Index;