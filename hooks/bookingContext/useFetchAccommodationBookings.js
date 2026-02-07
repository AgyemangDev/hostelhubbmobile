import { useState, useEffect, useCallback,useContext } from 'react';
import API_BASE_URL from '../../utils/api/api';
import { UserContext } from '../../context/UserContext'; 


export const useFetchAccommodationBookings = () => {
  const { userInfo, user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken(false);
      const res = await fetch(`${API_BASE_URL}/bookings/accommodation/fetch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch bookings');
      }

      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error fetching accommodation bookings:', err);
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