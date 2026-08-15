// context/BookingsContext.jsx
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useFetchAccommodationBookings } from '../hooks/bookingContext/useFetchAccommodationBookings';
import { useFetchStorageBookings } from '../hooks/bookingContext/useFetchStorageBookings';
import { useFetchTransportBookings } from '../hooks/bookingContext/useFetchTransportBookings';

const BookingsContext = createContext();

export const BookingsProvider = ({ children }) => {
  const accommodation = useFetchAccommodationBookings();
  const storage = useFetchStorageBookings();
  const transport = useFetchTransportBookings();

  const bookings = useMemo(() => {
    return [
      ...(accommodation.bookings || []),
      ...(storage.bookings || []),
      ...(transport.bookings || []),
    ];
  }, [accommodation.bookings, storage.bookings, transport.bookings]);

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
        bookings,
        loading: accommodation.loading || storage.loading || transport.loading,
        // Transport lives in UniGo's system; if it is down the other two are
        // still usable, so its failure must not surface as a hard error.
        error: accommodation.error || storage.error,
        transportError: transport.error,
        refetch,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookingsContext = () => useContext(BookingsContext);
