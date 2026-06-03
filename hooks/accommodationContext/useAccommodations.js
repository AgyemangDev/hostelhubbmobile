import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../utils/api/api";

const PAGE_SIZE = 20;

export const useAccommodations = () => {
  const { userInfo, user } = useContext(UserContext);
  const selectedUniversity = userInfo?.institution; // optional now

  const [accommodations, setAccommodations] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const loadingRef = useRef(false);

  const fetchPage = useCallback(async (pageNumber = 0, replace = false) => {
    if (!replace && loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      // Build URL — institution is optional
      const params = new URLSearchParams({ page: pageNumber, pageSize: PAGE_SIZE });
      if (selectedUniversity) params.append('institution', selectedUniversity);

      // Auth header is optional — attach only if logged in
      const headers = { 'Content-Type': 'application/json' };
      if (user) {
        const idToken = await user.getIdToken(false);
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/accommodations?${params}`, { headers });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch accommodations');
      }

      const result = await response.json();
      const data = result.data || [];

      replace ? setAccommodations(data) : setAccommodations(prev => [...prev, ...data]);
      setPage(pageNumber);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error('Accommodations fetch error:', err);
      setError(err.message);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [selectedUniversity, user]);

  useEffect(() => {
    setAccommodations([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    fetchPage(0, true); // fetch regardless of auth state
  }, [selectedUniversity, fetchPage]);

  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) fetchPage(page + 1);
  }, [page, hasMore, fetchPage]);

  const refresh = useCallback(() => {
    if (!loadingRef.current) { setHasMore(true); fetchPage(0, true); }
  }, [fetchPage]);

  return { accommodations, loading, error, hasMore, loadMore, refresh, selectedUniversity };
};