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
  const { user, userInfo } = useContext(UserContext);

  // Banner shows whenever expo_token is null
const showNotificationPrompt =
  !!user &&
  !!userInfo &&
  (
    userInfo.expo_token === null ||
    userInfo.expo_token === "null" ||
    userInfo.expo_token === ""
  );

  const handleEnableNotifications = async () => {
    if (!user) return;

    const token =
      await notificationService.registerForPushNotifications(user.uid);

    // ⛔️ Do NOT manually hide banner here
    // Supabase realtime update will update userInfo.expo_token
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