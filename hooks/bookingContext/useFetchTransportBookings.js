// hooks/bookingContext/useFetchTransportBookings.js
import { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../app/firebase/FirebaseConfig";
import { listBookings } from "../../utils/api/unigo";

/**
 * Bus trips this user booked through HostelHubb.
 *
 * Unlike accommodation and storage, these do not live in Firestore — they are
 * UniGo's records, pulled from its Partner API and tagged `type: 'transport'`
 * so they can sit alongside the other two in the Bookings tab. That also means
 * there is no live listener here: the list is fetched, and refetched on demand.
 */
export const useFetchTransportBookings = () => {
  const [user] = useAuthState(auth);
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
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
  };
};
