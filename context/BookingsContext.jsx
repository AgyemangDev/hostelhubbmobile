// context/BookingsContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../app/firebase/supabaseConfig';
import { UserContext } from './UserContext';

const BookingsContext = createContext();

export const useBookingsContext = () => useContext(BookingsContext);

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [storageBookings, setStorageBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useContext(UserContext);
  
  const channelRef = useRef(null);

  useEffect(() => {
    if (!userInfo?.id) {
      console.log('No user, clearing bookings');
      setBookings([]);
      setStorageBookings([]);
      setLoading(false);
      
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    const fetchBookings = async () => {
      try {
        console.log('Fetching bookings for user:', userInfo.id);
        const { data, error } = await supabase
          .from('accommodation_booking')
          .select('*')
          .eq('student_id', userInfo.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        console.log('Fetched bookings:', data?.length);
        setBookings(data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    setLoading(true);
    fetchBookings();

    // Setup realtime subscription
    if (channelRef.current) {
      console.log('Removing old channel');
      supabase.removeChannel(channelRef.current);
    }

    console.log('Setting up realtime subscription for user:', userInfo.id);

    const channel = supabase
      .channel(`bookings_${userInfo.id}`) // ← FIX: Was missing opening parenthesis
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'accommodation_booking',
          filter: `student_id=eq.${userInfo.id}`,
        },
        (payload) => {
          console.log('Realtime event received:', payload.eventType, payload);
          fetchBookings(); // Refetch all bookings
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to booking updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to channel');
        } else if (status === 'TIMED_OUT') {
          console.error('Subscription timed out');
        } else if (status === 'CLOSED') {
          console.log('Subscription closed');
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('Cleaning up bookings subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userInfo?.id]);

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        storageBookings,
        loading,
        error,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};