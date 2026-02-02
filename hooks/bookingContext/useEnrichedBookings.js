// hooks/bookingContext/useEnrichedBookings.js
import { useState, useEffect } from 'react';
import { useAccommodationById } from '../accommodationContext/useAccommodationById';

export const useEnrichedBooking = (booking) => {
  const { accommodation, loading } = useAccommodationById(booking?.accommodation_id);

  return {
    ...booking,
    accommodation,
    owner: accommodation?.owner,
    loading,
  };
};

// For multiple bookings
export const useEnrichedBookings = (bookings) => {
  const [enrichedBookings, setEnrichedBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookings || bookings.length === 0) {
      setEnrichedBookings([]);
      setLoading(false);
      return;
    }

    const fetchAllAccommodations = async () => {
      setLoading(true);
      
      const enriched = await Promise.all(
        bookings.map(async (booking) => {
          try {
            const { data } = await supabase
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

            return {
              ...booking,
              accommodation: data,
              owner: data?.owner,
            };
          } catch (err) {
            console.error(`Error fetching accommodation ${booking.accommodation_id}:`, err);
            return {
              ...booking,
              accommodation: null,
              owner: null,
            };
          }
        })
      );

      setEnrichedBookings(enriched);
      setLoading(false);
    };

    fetchAllAccommodations();
  }, [bookings]);

  return { enrichedBookings, loading };
};