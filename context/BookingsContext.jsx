import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../app/firebase/FirebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../app/firebase/FirebaseConfig';

const BookingsContext = createContext();

export const useBookingsContext = () => useContext(BookingsContext);

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [storageBookings, setStorageBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    let unsubscribeBookings;
    let unsubscribeStorage;

    if (user) {
      // --- Bookings Listener (Hostel Bookings) ---
      const bookingsRef = collection(db, 'Bookings');
      const bookingsQuery = query(bookingsRef, where('userId', '==', user.uid));

      unsubscribeBookings = onSnapshot(
        bookingsQuery,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            type: 'accommodation',
          }));
          setBookings(data);
        },
        (err) => {
          console.error('Error fetching hostel bookings:', err);
          setError(err.message);
        }
      );

      // --- Storage Listener (Storage Bookings) ---
      const storageRef = collection(db, 'Storage');
      const storageQuery = query(storageRef, where('userId', '==', user.uid));

      unsubscribeStorage = onSnapshot(
        storageQuery,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            type: 'storage', // Mark this type
          }));
          setStorageBookings(data);
        },
        (err) => {
          console.error('Error fetching storage bookings:', err);
          setError(err.message);
        }
      );

      // Finish loading when both are set (simple assumption)
      setLoading(false);
    } else {
      setBookings([]);
      setStorageBookings([]);
      setLoading(false);
    }

    // Cleanup both listeners
    return () => {
      unsubscribeBookings && unsubscribeBookings();
      unsubscribeStorage && unsubscribeStorage();
    };
  }, [user]);

  return (
    <BookingsContext.Provider
      value={{
        bookings,          // Hostel bookings
        storageBookings,   // Storage bookings
        loading,
        error,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};
