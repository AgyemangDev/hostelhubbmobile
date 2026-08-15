// hooks/bookingContext/useFetchTransportBookings.js
import { useState, useEffect, useCallback, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { listBookings } from "../../utils/api/unigo";

/**
 * Bus trips this user booked through HostelHubb.
 *
 * These live in UniGo's system, not HostelHubb's backend, so they are fetched
 * from the UniGo Partner API and tagged `type: 'transport'` to sit alongside
 * accommodation and storage bookings in the Bookings tab.
 */
export const useFetchTransportBookings = () => {
  const { user, userInfo } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!user?.uid) {
      setBookings([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await listBookings(user.uid);
      setBookings((data || []).map((booking) => ({ ...booking, type: "transport" })));
    } catch (err) {
      console.error("Error fetching transport bookings:", err);
      setError(err.message);
      // A UniGo outage must not blank out the whole Bookings tab.
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

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
