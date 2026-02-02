// app/(tabs)/(bookings)/AllBookings.jsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { supabase } from "../../../app/firebase/supabaseConfig";
import BookingList from "../../../components/BookingsComponent/BookingList";
import EmptyState from "../../../components/BookingsComponent/EmptyState";
import { useBookingsContext } from "../../../context/BookingsContext";

const AllBookings = ({ navigation }) => {
  const { bookings, storageBookings, loading: contextLoading } = useBookingsContext();
  const [enrichedBookings, setEnrichedBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const enrichBookings = async () => {
      if (contextLoading) {
        return;
      }
      
      setLoading(true);

      try {
        if (!bookings || bookings.length === 0) {
          setEnrichedBookings([]);
          setLoading(false);
          return;
        }

        // Fetch accommodation and owner data for each booking
        const enriched = await Promise.all(
          bookings.map(async (booking, index) => {
            
            try {
              const { data: accommodation, error } = await supabase
                .from("accommodation")
                .select(`
                  *,
                  room_types: accommodation_room_types(*),
                  owner: manager_id (
                    id,
                    firstname,
                    surname,
                    email,
                    phone,
                    address,
                    expopushtoken
                  )
                `)
                .eq("id", booking.accommodation_id)
                .single();

              if (error) {
                console.error(`Error fetching accommodation ${booking.accommodation_id}:`, error);
              }

              const enrichedBooking = {
                ...booking,
                type: 'accommodation', // ← CRITICAL: Set the type here
                hostelInfo: accommodation || null,
                hostelName: accommodation?.accommodation_name || 'Unknown Hostel',
                frontImage: accommodation?.images?.[0] || null,
                selectedRoomType: booking.room_type,
                selectedPayment: booking.payment_option,
                paymentStatus: booking.status === 'paid',
                adminUid: booking.accommodation_owner_id,
                adminInfo: accommodation?.owner ? {
                  firstName: accommodation.owner.firstname,
                  lastName: accommodation.owner.surname,
                  email: accommodation.owner.email,
                  phoneNumber: accommodation.owner.phone,
                  address: accommodation.owner.address,
                  expoPushToken: accommodation.owner.expopushtoken,
                } : null,
                bookingDate: new Date(booking.booking_date),
                acceptedDate: booking.action_date ? new Date(booking.action_date) : null,
              };

              return enrichedBooking;
            } catch (err) {
              console.error(`Failed to enrich booking ${booking.id}:`, err);
              return {
                ...booking,
                type: 'accommodation',
                hostelInfo: null,
                adminInfo: null,
              };
            }
          })
        );


        // Combine with storage bookings
        const combined = [...enriched, ...storageBookings];

        // Sort
        const sorted = combined.sort((a, b) => {
          if (a.acceptedDate && !b.acceptedDate) return -1;
          if (!a.acceptedDate && b.acceptedDate) return 1;
          if (a.acceptedDate && b.acceptedDate) {
            return b.acceptedDate - a.acceptedDate;
          }
          return b.bookingDate - a.bookingDate;
        });


        setEnrichedBookings(sorted);
      } catch (err) {
        console.error('Error enriching bookings:', err);
        setEnrichedBookings([]);
      } finally {
        setLoading(false);
      }
    };

    enrichBookings();
  }, [bookings, storageBookings, contextLoading]);

  if (contextLoading || loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {enrichedBookings.length === 0 ? (
        <EmptyState message="No Bookings Found." />
      ) : (
        <BookingList userBookings={enrichedBookings} navigation={navigation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AllBookings;