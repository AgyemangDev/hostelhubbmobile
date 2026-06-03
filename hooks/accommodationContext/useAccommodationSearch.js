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
    const search = async () => {
      if (!searchQuery || searchQuery.trim() === '') {
        setAccommodations([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ query: searchQuery });
        if (selectedUniversity) params.append('institution', selectedUniversity);

        const headers = { 'Content-Type': 'application/json' };
        if (user) {
          const idToken = await user.getIdToken(false);
          headers['Authorization'] = `Bearer ${idToken}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/accommodations/search?${params}`, { headers });
        if (!response.ok) throw new Error((await response.json()).error || 'Failed');

        const result = await response.json();
        setAccommodations(result.data || []);
      } catch (err) {
        setError(err.message);
        setAccommodations([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [selectedUniversity, searchQuery, user]);

  return { accommodations, loading, error };
};