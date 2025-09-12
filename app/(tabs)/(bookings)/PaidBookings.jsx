import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import PaidBookingList from '../../../components/BookingsComponent/PaidBookingList';
import EmptyState from '../../../components/BookingsComponent/EmptyState';
import { useBookingsContext } from '../../../context/BookingsContext';
import { useAdmin } from '../../../context/ManagersContext';
import { useHostels } from '../../../context/HostelsContext';
import { auth } from '../../firebase/FirebaseConfig';

const PaidBookings = ({ navigation }) => {
  const { bookings, storageBookings } = useBookingsContext();
  const { admins } = useAdmin();
  const { hostels } = useHostels();
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // 1. Get only paid hostel bookings
    const paidHostelBookings = bookings
      .filter(
        (booking) =>
          booking.userId === currentUser.uid && booking.paymentStatus === true
      )
      .map((booking) => {
        const admin = admins.find((a) => a.id === booking.adminUid);
        const hostel = hostels.find((h) => h.id === booking.hostelId);

        return {
          ...booking,
          adminInfo: admin ?? null,
          hostelInfo: hostel ?? null,
        };
      });

    // 2. Get all storage bookings (already paid)
    const paidStorageBookings = storageBookings.filter(
      (booking) => booking.userId === currentUser.uid
    );

    // 3. Combine and sort by latest date
    const combined = [...paidHostelBookings, ...paidStorageBookings];

    const sorted = combined.sort((a, b) => {
      const dateA = a.acceptedDate ?? a.bookingDate ?? 0;
      const dateB = b.acceptedDate ?? b.bookingDate ?? 0;
      return dateB - dateA;
    });

    setUserBookings(sorted);
  }, [bookings, storageBookings, admins, hostels]);

  return (
    <View style={styles.container}>
      {userBookings.length === 0 ? (
        <EmptyState message="No Paid Bookings Found." />
      ) : (
        <PaidBookingList userBookings={userBookings} navigation={navigation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});

export default PaidBookings;
