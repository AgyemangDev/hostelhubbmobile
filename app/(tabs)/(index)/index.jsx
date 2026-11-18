import React, { useEffect, useContext, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeTitleRow from "../../../components/headers/home/HomeTitleRow";
import HomeSearchBar from "../../../components/headers/home/HomeSearchBar";
import HorizontalScrollCardComponent from "../../../components/lists/home/HorizontalScrollCardComponent";
import CategoryNavigationCards from "../../../components/cards/home/CategoryNavigationCards";
import WhyHostelHubb from "../../../components/sections/home/WhyHostelHubb";
import StorageBannerSlider from "../../../components/banners/home/StorageBannerSlider";
import notificationService from "../../../lib/firebase/notificationService";
import { UserContext } from "../../../context/UserContext";
import NotificationPromptBanner from "../../../components/banners/home/NotificationPromptBanner";
import { colors } from "../../../constants/theme";

const Index = () => {
  const { user, userInfo, patchUserData } = useContext(UserContext);
  const [currentExpoToken, setCurrentExpoToken] = useState(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  // Height of the "Discover" row: how far the page scrolls before the search bar pins.
  const [titleHeight, setTitleHeight] = useState(0);

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
    // Bottom edge is left to the tab bar.
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        // The search bar (child 1) scrolls up with the title row, then locks at the top.
        stickyHeaderIndices={[1]}
      >
        <HomeTitleRow onLayout={(e) => setTitleHeight(e.nativeEvent.layout.height)} />
        <HomeSearchBar scrollY={scrollY} stickAt={titleHeight} />

        {showNotificationPrompt && (
          <NotificationPromptBanner onEnable={handleEnableNotifications} />
        )}

        <CategoryNavigationCards />
        <StorageBannerSlider />
        <HorizontalScrollCardComponent />
        <WhyHostelHubb />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
});

export default Index;