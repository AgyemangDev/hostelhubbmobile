import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  StatusBar,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { handleBookingProcess } from "../../services/bookingServices";

import { UserContext } from "../../context/UserContext";
import COLORS from "../../constants/Colors";
import { useAccommodationById } from "../../hooks/accommodationContext/useAccommodationById";

import HostelImageGallery from "../../components/HostelDetailsComponents/HostelImageGallery";
import LoadingScreen from "../../components/HostelDetailsComponents/LoadingScreen";
import HostelInfo from "../../components/HostelDetailsComponents/HostelInfo";
import PaymentRange from "../../components/HostelDetailsComponents/PaymentRange";
import Amenities from "../../components/HostelDetailsComponents/Amenities";
import BookingButton from "../../components/ButtonComponents/BookingButton";
import ReviewsModal from "../../components/modals/ReviewsModal";
import HostelDetailsHeader from "../../components/HostelDetailsComponents/HostelDetailsHeader";

import { updateHostelViewCount } from "../../utils/hostelViewCountUtil";

const DetailsScreen = () => {
  const { hostelId } = useLocalSearchParams();
  const { accommodation: hostel, loading } = useAccommodationById(hostelId);
    const { user, userInfo, patchUserData, refreshUserInfo, currentExpoToken } =
      useContext(UserContext);
  const navigation = useNavigation();
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => updateHostelViewCount(hostelId), 10000);
    return () => clearTimeout(timer);
  }, [hostelId]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Refresh user data every time the user comes back to this screen
  // (e.g. returning from bookingModal after a completed or cancelled booking)
  useFocusEffect(
    useCallback(() => {
      refreshUserInfo(true);
    }, [refreshUserInfo])
  );

  if (loading || !hostel) {
    return <LoadingScreen message="Loading hostel details..." />;
  }

  const buildPaymentRanges = (roomTypes = []) =>
    roomTypes.reduce((acc, room) => {
      const key = room.room_type;
      if (!acc[key]) acc[key] = [];
      acc[key].push({
        description: room.description,
        price: room.price,
        roomsAvailable: room.rooms_available,
        available: room.room_availability,
      });
      return acc;
    }, {});

  const handleCall = (phoneNumber) => {
    if (!userInfo.paymentStatus) {
      Alert.alert(
        "Support HostelHubb!",
        "Please subscribe to access this feature.",
        [
          { text: "Support", onPress: () => router.push("/transactions") },
          { text: "OK", style: "cancel" },
        ]
      );
      return;
    }
    Linking.openURL(`tel:${phoneNumber}`);
  };

const handleBookingPress = async () => {
  if (!hostel.accommodation_availability) {
    Alert.alert("Oops! Hostel Fully Booked", "This hostel is currently full.", [{ text: "OK" }]);
    return;
  }

  const firebaseToken = await user.getIdToken(true);

  await handleBookingProcess({
    user,
    userInfo,
    formData: {
      selectedRoomType: hostel.room_types?.[0]?.room_type,
      selectedPayment: hostel.room_types?.[0]?.price,
    },
    hostelId: hostel.id,
    bookingSource: "details",
    router,
    patchUserData,
    currentExpoToken,
    firebaseToken,
    onSuccess: () => router.push("/(tabs)/(bookings)"),
    onError: () => {},
  });
};

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    setScrolled(scrollPosition > 270);
  };

  const paymentRanges = buildPaymentRanges(hostel?.room_types || []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <HostelDetailsHeader hostel={hostel} hostelId={hostelId} scrolled={scrolled} />

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <HostelImageGallery images={hostel?.images || []} />

        <View style={styles.components}>
          <HostelInfo
            hostel={hostel}
            hostelDescription={hostel?.description || ""}
          />

          <TouchableOpacity
            style={styles.reviewsButton}
            onPress={() => setIsModalVisible(true)}
          >
            <MaterialIcons name="rate-review" size={20} color="#fff" />
            <Text style={styles.reviewsButtonText}>See All Reviews</Text>
          </TouchableOpacity>

          <ReviewsModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            hostelId={hostelId}
          />

          <PaymentRange paymentRanges={paymentRanges} />
          <Amenities amenities={hostel?.amenities || []} />
        </View>
      </ScrollView>

      <View style={styles.fixedBookingButtonContainer}>
        <BookingButton onPress={handleBookingPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollViewContent: { paddingBottom: 120 },
  components: { marginHorizontal: 10 },
  reviewsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "center",
    marginVertical: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  reviewsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  fixedBookingButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default DetailsScreen;