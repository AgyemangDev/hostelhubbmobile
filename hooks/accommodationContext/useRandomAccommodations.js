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
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ limit });
        if (selectedUniversity) params.append('institution', selectedUniversity);

        const headers = { 'Content-Type': 'application/json' };
        if (user) {
          const idToken = await user.getIdToken(false);
          headers['Authorization'] = `Bearer ${idToken}`;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/accommodations/random?${params}`,
          { method: 'GET', headers }
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

    fetchRandomAccommodations(); // no guard — runs for guests too
  }, [selectedUniversity, limit, user]);

  return { accommodations, loading, error };
};