import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../utils/api/api";

export const useAccommodationById = (accommodationId) => {
  const { user } = useContext(UserContext);
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accommodationId || !user) {
      setLoading(false);
      return;
    }

    const fetchAccommodation = async () => {
      setLoading(true);

      try {
        // Get Firebase ID token from context user (with cache)
        const idToken = await user.getIdToken(false);

        // Call backend API
        const response = await fetch(
          `${API_BASE_URL}/api/accommodations/${accommodationId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch accommodation');
        }

        const result = await response.json();
        setAccommodation(result.data);
      } catch (err) {
        console.error('Accommodation by ID error:', err);
        setError(err.message);
        setAccommodation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodation();
  }, [accommodationId, user]);

  return { accommodation, loading, error };
};