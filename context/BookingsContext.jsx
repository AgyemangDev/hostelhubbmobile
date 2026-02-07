// context/BookingsContext.jsx
import React, { createContext, useContext, useMemo } from 'react';
import { useFetchAccommodationBookings } from '../hooks/bookingContext/useFetchAccommodationBookings';
import { useFetchStorageBookings } from '../hooks/bookingContext/useFetchStorageBookings';

const BookingsContext = createContext();

export const BookingsProvider = ({ children }) => {
  const accommodation = useFetchAccommodationBookings();
  const storage = useFetchStorageBookings();

  const bookings = useMemo(() => {
    return [
      ...(accommodation.bookings || []), // already has type: accommodation
      ...(storage.bookings || []),       // we added type: storage
    ];
  }, [accommodation.bookings, storage.bookings]);

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        loading: accommodation.loading || storage.loading,
        error: accommodation.error || storage.error,
        refetch: () => {
          accommodation.refetch();
          storage.refetch();
        },
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookingsContext = () => useContext(BookingsContext);