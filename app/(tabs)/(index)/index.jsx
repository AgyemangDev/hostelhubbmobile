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
import BalanceButton from "../../../components/ButtonComponents/BalanceButton";
import StorageBannerSlider from "../../../components/Sliders/StorageBannerSlider";
import notificationService from "../../firebase/notificationService";
import { UserContext } from "../../../context/UserContext";
import NotificationPromptBanner from "../../../components/BannerComponents/Notificationpromptbanner";

const Index = () => {
  const { user, userInfo, patchUserData } = useContext(UserContext);
  const [currentExpoToken, setCurrentExpoToken] = useState(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      if (!user) {
        setIsCheckingToken(false);
        return;
      }
      try {
        const token = await notificationService.registerForPushNotifications(user.uid);
        setCurrentExpoToken(token);
      } catch (err) {
        console.error('❌ Failed to get current Expo token:', err);
      } finally {
        setIsCheckingToken(false);
      }
    };
    fetchToken();
  }, [user]);

  const showNotificationPrompt = React.useMemo(() => {
    if (!user || !userInfo || isCheckingToken) return false;
    const storedToken = userInfo.expo_token;
    return (
      !storedToken ||
      storedToken === 'null' ||
      storedToken === '' ||
      storedToken === null ||
      (currentExpoToken && storedToken !== currentExpoToken)
    );
  }, [user, userInfo, currentExpoToken, isCheckingToken]);

  const handleEnableNotifications = async () => {
    if (!user) return;
    try {
      const expoToken = await notificationService.registerForPushNotifications(user.uid);
      if (!expoToken) return;
      await patchUserData({
        expo_token: expoToken,
        last_interacted: new Date().toISOString(),
      });
      setCurrentExpoToken(expoToken);
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
          <NotificationPromptBanner onEnable={handleEnableNotifications} />
        )}

        <CategoryNavigationCards />
        <StorageBannerSlider />
        <HorizontalScrollCardComponent />
        <BenefitSlider benefits={hostelBenefits} />
      </ScrollView>

      {/* FAB stack — Balance sits above WhatsApp */}
      <BalanceButton />
      <WhatsAppButton size={60} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
});

export default Index;