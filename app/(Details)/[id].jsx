import React, { useEffect,useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useHostels } from "../../context/HostelsContext";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import COLORS from "../../constants/Colors";

// Import components
import HostelImageGallery from "../../components/HostelDetailsComponents/HostelImageGallery";
import LoadingScreen from "../../components/HostelDetailsComponents/LoadingScreen";
import HostelInfo from "../../components/HostelDetailsComponents/HostelInfo";
import PaymentRange from "../../components/HostelDetailsComponents/PaymentRange";
import Amenities from "../../components/HostelDetailsComponents/Amenities";
import PorterInfo from "../../components/HostelDetailsComponents/PorterInfo";
import BookingButton from "../../components/HostelDetailsComponents/BookingButton";
import ReviewsModal from "../../components/ReviewsModal";
import HostelDetailsHeader from "../../components/HostelDetailsComponents/HostelDetailsHeader";

// Import utilities
import { updateHostelViewCount } from "../../utils/hostelViewCountUtil";

const DetailsScreen = () => {
  const { hostelId } = useLocalSearchParams();
  const { hostels, loading } = useHostels();
  const { userInfo } = useContext(UserContext);
  const hostel = hostels.find((item) => item.id === hostelId);
  const navigation = useNavigation();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  

  useEffect(() => {
    // Delay the view update by 30 seconds
    const timer = setTimeout(() => updateHostelViewCount(hostelId), 30000);
    
    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [hostelId]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  if (loading || !hostel) {
  return <LoadingScreen message="Loading hostel details..." />;
}

  const handleCall = (phoneNumber) => {
    if (!userInfo.paymentStatus) {
      Alert.alert(
        "Support HostelHubb!",
        "Your subscription helps us keep HostelHubb running and continue providing quality services. Please subscribe to access this feature. For assistance, feel free to contact our customer support team.",
        [
          {
            text: "Support",
            onPress: () => router.push("/transactions"),
            style: "default",
          },
          {
            text: "OK",
            style: "cancel",
          },
        ]
      );
      return;
    }
  
    // If paymentStatus is true, proceed with the call
    Linking.openURL(`tel:${phoneNumber}`);
  };
  
  const handleBookingPress = () => {
    if (!hostel.hostelAvailability) {
      Alert.alert(
        "Hostel Full",
        "This hostel is fully booked. You cannot proceed with the booking.",
        [{ text: "OK" }]
      );
      return;
    }
  
    navigation.navigate("bookingModal", {
      hostelId: hostel.id,
      managerId: hostel.managerId,
    });
  };

  const handleShowReviews = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  return (
    <View style={styles.container}>  
        <HostelDetailsHeader hostel={hostel} hostelId={hostelId} />
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>

        <HostelImageGallery images={hostel?.images || []} />
        <View style={styles.components}>
          <HostelInfo
            hostel={hostel}
            hostelDescription={hostel?.description || ""}
          />

          <TouchableOpacity
            style={styles.reviewsButton}
            onPress={handleShowReviews}
          >
            <MaterialIcons name="rate-review" size={20} color="#ffffff" />
            <Text style={styles.reviewsButtonText}>See All Reviews</Text>
          </TouchableOpacity>

          <ReviewsModal
            visible={isModalVisible}
            onClose={handleCloseModal}
            hostelId={hostelId}
          />

          <PaymentRange paymentRanges={hostel?.paymentRanges || []} />
          <Amenities amenities={hostel?.amenities || []} />
          {/* <PorterInfo
            porter={hostel?.porter || ""}
            contact={hostel?.porterContact || ""}
            onCallPress={handleCall}
          /> */}
        </View>
      </ScrollView>

      {/* Fixed Booking Button */}
      <View style={styles.fixedBookingButtonContainer}>
        <BookingButton onPress={handleBookingPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollViewContent: {
    paddingBottom: 120, // Make space for the fixed button at the bottom
  },
  components: {
    marginHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "center",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  reviewsButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  // Fixed booking button container
  fixedBookingButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    elevation: 5,
  },
});

export default DetailsScreen;
