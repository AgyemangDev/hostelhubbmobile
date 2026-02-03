import React, { useEffect, useContext } from "react";
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

  const [currentExpoToken, setCurrentExpoToken] = React.useState(null);

  // Get the current Expo push token for this device
  useEffect(() => {
    const fetchToken = async () => {
      if (!user) return;

      try {
        const token = await notificationService.registerForPushNotifications(user.uid);
        setCurrentExpoToken(token);
      } catch (err) {
        console.error('Failed to get current Expo token:', err);
      }
    };

    fetchToken();
  }, [user]);

  const showNotificationPrompt =
    !!user &&
    !!userInfo &&
    (
      !userInfo.expo_token ||
      userInfo.expo_token === 'null' ||
      userInfo.expo_token === '' ||
      (currentExpoToken && userInfo.expo_token !== currentExpoToken)
    );
// Index.jsx - FIX handleEnableNotifications to use cached token

const handleEnableNotifications = async () => {
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
    console.log('Expo token received:', expoToken);
    
    if (!expoToken) {
      console.log('❌ No expo token, returning');
      return;
    }

    console.log('Step 2: Calling patchUserData...');
    await patchUserData({
      expo_token: expoToken,
      last_interacted: new Date().toISOString(),
    });

    console.log('✅ Notification update completed');
  } catch (err) {
    console.error('❌ Failed to enable notifications:', err);
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
