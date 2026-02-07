// hooks/useFetchStorageBookings.js
import { useState, useEffect, useCallback, useContext } from 'react';
import API_BASE_URL from '../../utils/api/api';
import { UserContext } from '../../context/UserContext';

export const useFetchStorageBookings = () => {
  const { user, userInfo } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const fetchBookings = useCallback(async () => {
  if (!user) return;

  setLoading(true);
  setError(null);

  try {
    const token = await user.getIdToken(false);

    const res = await fetch(`${API_BASE_URL}/bookings/storage/fetch`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const rawText = await res.text(); // ✅ read ONCE

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error('Non-JSON response:', rawText);
      throw new Error('Server returned an invalid response');
    }

    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch storage bookings');
    }

    const storageBookings = (data.bookings || []).map((booking) => ({
      ...booking,
      type: 'storage',
    }));

    setBookings(storageBookings);
  } catch (err) {
    console.error('Error fetching storage bookings:', err);
    setError(err.message);
    setBookings([]);
  } finally {
    setLoading(false);
  }
}, [user]);

  useEffect(() => {
    if (userInfo?.id) {
      fetchBookings();
    } else {
      setBookings([]);
    }
  }, [userInfo?.id, fetchBookings]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
  };
};