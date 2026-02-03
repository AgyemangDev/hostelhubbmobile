import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../utils/api/api";

export const useRandomAccommodations = (limit = 40) => {
  const { user, userInfo } = useContext(UserContext);
  const selectedUniversity = userInfo?.institution;

  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomAccommodations = async () => {
      if (!selectedUniversity || !user) {
        setAccommodations([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Get Firebase ID token from context user (with cache)
        const idToken = await user.getIdToken(false);

        // Call backend API
        const response = await fetch(
          `${API_BASE_URL}/api/accommodations/random?institution=${encodeURIComponent(selectedUniversity)}&limit=${limit}`,
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
          throw new Error(errorData.error || 'Failed to fetch accommodations');
        }

        const result = await response.json();
        setAccommodations(result.data || []);
      } catch (err) {
        console.error("Random accommodations error:", err);
        setError(err.message);
        setAccommodations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomAccommodations();
  }, [selectedUniversity, limit, user]);

  return { accommodations, loading, error };
};