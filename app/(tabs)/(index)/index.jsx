import React,{useEffect} from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import CustomHeader from "../../../components/Headers/CustomHeader";
import HorizontalScrollCardComponent from "../../../components/HomeComponents/HorizontalScrollCardComponent";
import CategoryNavigationCards from "../../../components/HomeComponents/CategoryNavigationCards";
import BenefitSlider from "../../../components/BenefitSlider/BenefitSlider";
import { hostelBenefits } from "../../../assets/data/SlideData";
import notificationService from "../../firebase/notificationService"
import { useNavigation } from "expo-router";
import StorageBanner from "../../../components/BannerComponents/Banner";
import StoreData from "../../../assets/data/StoreData";

const Index = () => {
   const navigation = useNavigation();

  // const handleStorageFacilityPress = () => {
  //   router.push({
  //     pathname: "(StorageForm)",
  //   });
  // };

  const handleStorageFacilityPress = () => {
  alert("Storage reservation has closed for this semester. Thank you for trusting us.");
};

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header with padding */}



      {/* Scrollable content with horizontal padding */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]} // 👈 THIS makes the top part sticky
      >
        {/* 0th item = the sticky header */}
        <View style={styles.headerWrapper}>
          <CustomHeader />
        </View>

        {/* Scrollable content */}
        <CategoryNavigationCards />
          {StoreData.map((facility) => (
          <StorageBanner
            key={facility.id}
            facility={facility}
            onPress={handleStorageFacilityPress}
          />
        ))}

        <HorizontalScrollCardComponent />
        <BenefitSlider benefits={hostelBenefits} />
      </ScrollView>
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
    backgroundColor: "#fff", // Important to avoid transparency
    zIndex: 10,
  },
});

export default Index;
