import React, { createContext, useContext } from 'react';
import { useFetchAccommodationBookings } from '../hooks/bookingContext/useFetchAccommodationBookings';

const BookingsContext = createContext();
export const useBookingsContext = () => useContext(BookingsContext);

export const BookingsProvider = ({ children }) => {
  const { bookings, loading, error, refetch } = useFetchAccommodationBookings();

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        loading,
        error,
        refetch, // Can be called manually if needed
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};
