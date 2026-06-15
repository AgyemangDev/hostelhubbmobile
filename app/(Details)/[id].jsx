import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  StatusBar,
  Animated,
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
  const scrollY = React.useRef(new Animated.Value(0)).current;

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


const handleBookingPress = () => {
  if (!hostel.accommodation_availability) {
    Alert.alert("Oops! Hostel Fully Booked", "This hostel is currently full.", [{ text: "OK" }]);
    return;
  }

  router.push({
    pathname: "/bookingModal",
    params: { hostelId: hostel.id }
  });
};

  const paymentRanges = buildPaymentRanges(hostel?.room_types || []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
<HostelDetailsHeader
  hostel={hostel}
  hostelId={hostelId}
  scrollY={scrollY}
/>

<Animated.ScrollView
  contentContainerStyle={styles.scrollViewContent}
  showsVerticalScrollIndicator={false}
  scrollEventThrottle={16}
  onScroll={Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            y: scrollY,
          },
        },
      },
    ],
    { useNativeDriver: true }
  )}
>
        <HostelImageGallery images={hostel?.images || []} />

        <View style={styles.components}>
          <HostelInfo
            hostel={hostel}
            hostelDescription={hostel?.description || ""}
          />

<TouchableOpacity onPress={() => setIsModalVisible(true)}>
  <Text style={styles.reviewsLink}>See all reviews</Text>
</TouchableOpacity>

          <ReviewsModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            hostelId={hostelId}
          />

          <PaymentRange paymentRanges={paymentRanges} />
          <Amenities amenities={hostel?.amenities || []} />
        </View>
      </Animated.ScrollView>

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
  reviewsLink: {
  fontSize: 13,
  color: "#888",
  textDecorationLine: "underline",
  marginTop: -26,
  marginBottom: 16,
},
});

export default DetailsScreen;