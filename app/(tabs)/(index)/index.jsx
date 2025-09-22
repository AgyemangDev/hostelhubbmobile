import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import CustomHeader from "../../../components/Headers/CustomHeader";
import HorizontalScrollCardComponent from "../../../components/HomeComponents/HorizontalScrollCardComponent";
import CategoryNavigationCards from "../../../components/HomeComponents/CategoryNavigationCards";
import BenefitSlider from "../../../components/BenefitSlider/BenefitSlider";
import { hostelBenefits } from "../../../assets/data/SlideData";
import notificationService from "../../firebase/notificationService";
import StorageBanner from "../../../components/BannerComponents/Banner";
import StoreData from "../../../assets/data/StoreData";
import { WhatsAppButton } from "../../../components/ButtonComponents/WhatsAppButton";

const { width } = Dimensions.get("window");

const Index = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const registerPushNotifications = async () => {
      const token = await notificationService.registerForPushNotifications();
      if (token) {
        console.log("Push token registered and stored in Firestore");
      }
    };

    registerPushNotifications();
    notificationService.listenToNotifications();
  }, []);

  // Auto scroll every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % StoreData.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = (event) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setCurrentIndex(slideIndex);
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

        <CategoryNavigationCards />

        {/* Horizontal banner carousel */}
        <View>
          <FlatList
            ref={flatListRef}
            data={StoreData}
            renderItem={({ item }) => <StorageBanner facility={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />

          {/* Pagination dots */}
          <View style={styles.pagination}>
            {StoreData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex ? styles.activeDot : null,
                ]}
              />
            ))}
          </View>
        </View>

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
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  headerWrapper: {
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    zIndex: 10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#610b0c",
    width: 12,
  },
});

export default Index;
