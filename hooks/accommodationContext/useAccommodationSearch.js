// hooks/accommodationContext/useAccommodationSearch.js - UPDATE

import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../utils/api/api";

export const useAccommodationSearch = (searchQuery) => {
  const { user, userInfo } = useContext(UserContext);
  const selectedUniversity = userInfo?.institution;

  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchAccommodations = async () => {
      if (!selectedUniversity || !user || !searchQuery || searchQuery.trim() === '') {
        setAccommodations([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const idToken = await user.getIdToken(false);

        const response = await fetch(
          `${API_BASE_URL}/api/accommodations/search?institution=${encodeURIComponent(selectedUniversity)}&query=${encodeURIComponent(searchQuery)}`,
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
          throw new Error(errorData.error || 'Failed to search accommodations');
        }

        const result = await response.json();
        setAccommodations(result.data || []);
      } catch (err) {
        console.error("Search accommodations error:", err);
        setError(err.message);
        setAccommodations([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchAccommodations, 300);
    return () => clearTimeout(debounceTimer);
  }, [selectedUniversity, searchQuery, user]);

  return { accommodations, loading, error };
};