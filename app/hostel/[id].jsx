import React, { useEffect, useContext, useState } from "react";
import { View, StyleSheet, StatusBar, Animated } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

import { UserContext } from "../../context/UserContext";
import { useAccommodationById } from "../../hooks/accommodationContext/useAccommodationById";

import HostelImageGallery from "../../components/media/accommodation/HostelImageGallery";
import HostelDetailsSkeleton from "../../components/skeletons/accommodation/HostelDetailsSkeleton";
import HostelInfo from "../../components/sections/accommodation/HostelInfo";
import PaymentRange from "../../components/sections/accommodation/PaymentRange";
import Amenities from "../../components/sections/accommodation/Amenities";
import AccommodationRules from "../../components/sections/accommodation/AccommodationRules";
import ReserveBar from "../../components/bars/accommodation/ReserveBar";
import { Notice } from "../../components/ui";
import { listingFacts } from "../../utils/listingFacts";
import ReviewsModal from "../../components/sheets/accommodation/ReviewsModal";
import ReviewsSection from "../../components/sections/accommodation/ReviewsSection";
import HostelDetailsHeader from "../../components/headers/accommodation/HostelDetailsHeader";

import { updateHostelViewCount } from "../../utils/hostelViewCountUtil";
import { colors, space } from "../../constants/theme";

const DetailsScreen = () => {
  // `id` is the route segment (/hostel/:id). It may be an accommodation id or,
  // from a shared website link, its slug; useAccommodationById handles both.
  // `hostelId` is still accepted from older navigation calls.
  const params = useLocalSearchParams();
  const routeKey = params.id ?? params.hostelId;
  const { accommodation: hostel, loading } = useAccommodationById(routeKey);
  const hostelId = hostel?.id ?? routeKey;
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

  // Profile data (name, phone, ...) now arrives via
  // UserContext's SSE push connection instead of a focus-triggered refetch.

  if (loading || !hostel) {
    return <HostelDetailsSkeleton />;
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


const facts = listingFacts(hostel);
  const fullyBooked = hostel.accommodation_availability === false || facts.roomsLeft === 0;

  const handleBookingPress = () => {
  router.push({
    pathname: "/bookingModal",
    params: { hostelId: hostel.id }
  });
};

  const paymentRanges = buildPaymentRanges(hostel?.room_types || []);
  const allImages = [
    hostel.front_image,
    ...(hostel.images || []),
    ...(hostel.room_types || []).flatMap((room) => room.images || []),
  ].filter(Boolean).filter((image, index, images) => images.indexOf(image) === index);

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
        <HostelImageGallery images={allImages} />

        <View style={styles.components}>
          <HostelInfo
            hostel={hostel}
            hostelDescription={hostel?.description || ""}
          />

          <ReviewsModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            hostelId={hostelId}
          />

          {Object.keys(paymentRanges).length ? (
            <PaymentRange paymentRanges={paymentRanges} />
          ) : (
            <Notice style={styles.missingData}>Room pricing has not been provided yet.</Notice>
          )}
          <Amenities amenities={hostel?.amenities || []} />
          <AccommodationRules rules={hostel?.accommodation_rules || {}} category={hostel?.category} />
          <ReviewsSection accommodationId={hostel.id} verified={hostel.is_verified} />
        </View>
      </Animated.ScrollView>

      <View style={styles.reserveBar}>
        <ReserveBar fromPrice={facts.fromPrice} roomsLeft={facts.roomsLeft} fullyBooked={fullyBooked} onReserve={handleBookingPress} accommodationId={hostel.id} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollViewContent: { paddingBottom: 120 },
  components: { marginHorizontal: space.md },
  missingData: { marginTop: space.md, marginBottom: space.xl },
  reserveBar: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default DetailsScreen;