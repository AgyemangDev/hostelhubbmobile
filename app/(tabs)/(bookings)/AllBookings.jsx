import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import BookingList from "../../../components/BookingsComponent/BookingList";
import EmptyState from "../../../components/BookingsComponent/EmptyState";
import { useBookingsContext } from "../../../context/BookingsContext";
import { useAdmin } from "../../../context/ManagersContext";
import { useHostels } from "../../../context/HostelsContext";

const AllBookings = ({ navigation }) => {
  const { bookings, storageBookings, transportBookings, refetchTransport } =
    useBookingsContext();
  const { admins } = useAdmin();
  const { hostels } = useHostels();
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    // Map hostel bookings to enrich with admin & hostel data
    const enrichedHostelBookings = bookings.map((booking) => {
      const admin = admins.find((admin) => admin.id === booking.adminUid);
      const hostel = hostels.find((hostel) => hostel.id === booking.hostelId);

      return {
        ...booking,
        adminInfo: admin ? admin.personalInfo : null,
        hostelInfo: hostel ?? null,
      };
    });

    // Unpaid bus trips belong here too: the seat hold is still running and this
    // list is where the user can go back and finish paying.
    const enrichedTransportBookings = (transportBookings || []).map((booking) => ({
      ...booking,
      bookingDate: booking.createdAt ? new Date(booking.createdAt).getTime() : 0,
    }));

    // Combine hostel + storage + transport bookings
    const combined = [
      ...enrichedHostelBookings,
      ...storageBookings,
      ...enrichedTransportBookings,
    ];

    // Sort combined bookings
    const sortedBookings = combined.sort((a, b) => {
      if (a.acceptedDate && !b.acceptedDate) return -1;
      if (!a.acceptedDate && b.acceptedDate) return 1;
      if (a.acceptedDate && b.acceptedDate) return b.acceptedDate - a.acceptedDate;

      return b.bookingDate - a.bookingDate;
    });

    setUserBookings(sortedBookings);
  }, [bookings, storageBookings, transportBookings, admins, hostels]);

  return (
    <View style={styles.container}>
      {userBookings.length === 0 ? (
        <EmptyState message="No Bookings Found." />
      ) : (
        <BookingList
          userBookings={userBookings}
          navigation={navigation}
          onChanged={refetchTransport}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
});

export default AllBookings;
