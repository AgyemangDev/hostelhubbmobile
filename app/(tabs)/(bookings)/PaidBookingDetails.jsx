import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useBookingsContext } from '../../../context/BookingsContext';
import { useAdmin } from '../../../context/ManagersContext';
import { useHostels } from '../../../context/HostelsContext';
import { UserContext } from '../../../context/UserContext';
import BookingDetails from '../../../components/BookingsComponent/BookingDetails';
import ComplaintSection from '../../../components/BookingsComponent/ComplaintSection';
import ReviewSection from '../../../components/BookingsComponent/ReviewSection';
import MinimalBookingDetails from '../../../components/BookingsComponent/MinimalBookingDetails';

const PaidBookingDetails = () => {
  const route = useRoute();
  const { bookingId } = route.params;
  const { bookings } = useBookingsContext();
  const { admins } = useAdmin();
  const { hostels } = useHostels();
  const { userInfo } = useContext(UserContext);

  const booking = bookings.find((b) => b.id === bookingId);
  console.log("Booking Details:", booking);
  if (!booking) {
    return (
      <View style={{ padding: 20 }}>
        <Text>No booking found with this ID.</Text>
      </View>
    );
  }

  const hostel = booking.hostelInfo || hostels.find((h) => h.id === booking.hostelId);
  const admin = booking.adminInfo || admins.find((a) => a.id === booking.adminUid);

  const isFallback = !hostel || !admin;
  const userId = booking.userId || userInfo?.id;

  return (
    <ScrollView>
      {isFallback ? (
        <MinimalBookingDetails booking={booking} />
      ) : (
        <>
          <BookingDetails booking={booking} hostel={hostel} admin={admin} userInfo={userInfo} />
          <ComplaintSection
            bookingId={booking.id}
            userId={userId}
            hostelId={booking.hostelId}
            adminId={booking.adminUid}
          />
          <ReviewSection
            bookingId={booking.id}
            userId={userId}
            hostelId={booking.hostelId}
            adminId={booking.adminUid}
          />
        </>
      )}
    </ScrollView>
  );
};

export default PaidBookingDetails;
