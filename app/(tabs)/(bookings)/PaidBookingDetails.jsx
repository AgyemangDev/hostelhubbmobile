// import React, { useContext } from 'react';
// import { View, Text, ScrollView } from 'react-native';
// // import { useRoute } from '@react-navigation/native';
// // import BookingDetails from '../../../components/BookingsComponent/BookingDetails';
// // import ComplaintSection from '../../../components/BookingsComponent/ComplaintSection';
// // import ReviewSection from '../../../components/BookingsComponent/ReviewSection';
// // import MinimalBookingDetails from '../../../components/BookingsComponent/MinimalBookingDetails';

// const PaidBookingDetails = () => {
 

//   return (
//     <ScrollView>
//       {/* {isFallback ? (
//         <MinimalBookingDetails booking={booking} />
//       ) : (
//         <>
//           <BookingDetails booking={booking} hostel={hostel} admin={admin} userInfo={userInfo} />
//           <ComplaintSection
//             bookingId={booking.id}
//             userId={userId}
//             hostelId={booking.hostelId}
//             adminId={booking.adminUid}
//           />
//           <ReviewSection
//             bookingId={booking.id}
//             userId={userId}
//             hostelId={booking.hostelId}
//             adminId={booking.adminUid}
//           />
//         </>
//       )} */}
//     </ScrollView>
//   );
// };

// export default PaidBookingDetails;

import React from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

const PaidBookingDetails = () => {
  const { item } = useLocalSearchParams();

  // 🛡️ item comes as a string sometimes → parse safely
  const booking = typeof item === "string" ? JSON.parse(item) : item;

  if (!booking) {
    return (
      <View style={styles.centered}>
        <Text>Booking not found</Text>
      </View>
    );
  }

  const accommodation = booking.accommodation;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image */}
      {accommodation?.front_image && (
        <Image
          source={{ uri: accommodation.front_image }}
          style={styles.image}
        />
      )}

      {/* Main Details */}
      <View style={styles.card}>
        <Text style={styles.title}>
          {accommodation?.accommodation_name}
        </Text>

        <Text style={styles.label}>
          Room Type:{" "}
          <Text style={styles.value}>{booking.room_type}</Text>
        </Text>

        <Text style={styles.label}>
          Amount Paid:{" "}
          <Text style={styles.value}>
            GHS {booking.payment_option}
          </Text>
        </Text>

        <Text style={styles.label}>
          Payment Status:{" "}
          <Text style={styles.paid}>Paid</Text>
        </Text>

        {booking.payment_date && (
          <Text style={styles.label}>
            Paid On:{" "}
            <Text style={styles.value}>
              {new Date(booking.payment_date).toDateString()}
            </Text>
          </Text>
        )}
      </View>

      {/* Location */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text>{accommodation?.location}</Text>
      </View>

      {/* Owner Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Hostel Manager</Text>
        <Text>
          {booking.owner?.firstname} {booking.owner?.surname}
        </Text>
        <Text>{booking.owner?.phone}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    marginTop: 6,
    color: "#374151",
  },
  value: {
    fontWeight: "600",
  },
  paid: {
    color: "#10B981",
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
});

export default PaidBookingDetails;

