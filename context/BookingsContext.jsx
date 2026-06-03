// context/BookingsContext.jsx
import React, { createContext,useCallback, useContext, useMemo } from 'react';
import { useFetchAccommodationBookings } from '../hooks/bookingContext/useFetchAccommodationBookings';
import { useFetchStorageBookings } from '../hooks/bookingContext/useFetchStorageBookings';

const BookingsContext = createContext();

// context/BookingsContext.jsx
export const BookingsProvider = ({ children }) => {
  const accommodation = useFetchAccommodationBookings();
  const storage = useFetchStorageBookings();

  const bookings = useMemo(() => {
    return [
      ...(accommodation.bookings || []),
      ...(storage.bookings || []),
    ];
  }, [accommodation.bookings, storage.bookings]);

  const refetch = useCallback(async () => {
    await Promise.all([
      accommodation.refetch(),
      storage.refetch(),
    ]);
  }, [accommodation.refetch, storage.refetch]);

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        loading: accommodation.loading || storage.loading,
        error: accommodation.error || storage.error,
        refetch,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookingsContext = () => useContext(BookingsContext);