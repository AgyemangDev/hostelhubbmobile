// context/BookingsContext.jsx
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useFetchAccommodationBookings } from '../hooks/bookingContext/useFetchAccommodationBookings';
import { useFetchStorageBookings } from '../hooks/bookingContext/useFetchStorageBookings';
import { useFetchTransportBookings } from '../hooks/transport/useFetchTransportBookings';

const BookingsContext = createContext();

export const useBookingsContext = () => useContext(BookingsContext);

export const BookingsProvider = ({ children }) => {
  const accommodation = useFetchAccommodationBookings();
  const storage = useFetchStorageBookings();
  // Bus trips come from UniGo's API rather than the app's own backend, so they
  // arrive through their own fetch hook, same shape as the other two.
  const transport = useFetchTransportBookings();

  // Kept as three separate arrays (not merged into one `bookings` list) since
  // AllBookings.jsx / PaidBookings.jsx / BookingList.jsx branch on
  // bookings vs storageBookings vs transportBookings individually.
  const bookings = accommodation.bookings || [];
  const storageBookings = storage.bookings || [];
  const transportBookings = transport.bookings || [];

  const loading = accommodation.loading || storage.loading;
  const error = accommodation.error || storage.error;

  const refetch = useCallback(async () => {
    await Promise.all([
      accommodation.refetch(),
      storage.refetch(),
      transport.refetch(),
    ]);
  }, [accommodation.refetch, storage.refetch, transport.refetch]);

  return (
    <BookingsContext.Provider
      value={{
        bookings,                // Hostel bookings
        storageBookings,         // Storage bookings
        transportBookings,       // UniGo bus trips
        loading,
        error,
        // UniGo is a separate system; when it is down the other two are still
        // usable, so its failure is reported apart from `error` rather than
        // taking the whole tab down with it.
        transportError: transport.error,
        refetchTransport: transport.refetch,
        // Refetches all three sources — used by screens that pull-to-refresh
        // or silently refresh on focus (e.g. index.jsx's useFocusEffect).
        refetch,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};