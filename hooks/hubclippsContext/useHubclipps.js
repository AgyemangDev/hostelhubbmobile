import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../utils/api/api";

const PAGE_SIZE = 10;

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const INITIAL_FILTERS = {
  institution: null,
  accommodationType: null,
  priceRange: null,
  roomType: null,
};

const buildQuery = (userInstitution, filters, page) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(PAGE_SIZE),
  });

  // institution is optional — use filter override > user institution > omit
  const institution = filters.institution ?? userInstitution;
  if (institution) params.set("institution", institution);

  if (filters.accommodationType) params.set("category", filters.accommodationType);
  if (filters.roomType)          params.set("room_type", filters.roomType);
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    params.set("minPrice", String(min));
    params.set("maxPrice", String(max));
  }

  return params.toString();
};

export const useHubclipps = () => {
  const { user, userInfo } = useContext(UserContext);
  const userInstitution = userInfo?.institution;

  const [hubclipps, setHubclipps] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [hasMore,   setHasMore]   = useState(true);
  const [filters,   setFilters]   = useState(INITIAL_FILTERS);

  const pageRef    = useRef(0);
  const loadingRef = useRef(false);

  const fetchPage = useCallback(
    async (pageNumber = 0, replace = false, filtersSnapshot = filters) => {
      if (loadingRef.current) return; // removed !user && !userInstitution guard

      try {
        loadingRef.current = true;
        setLoading(true);

        const headers = { "Content-Type": "application/json" };
        if (user) {
          const token = await user.getIdToken(false);
          headers["Authorization"] = `Bearer ${token}`;
        }

        const qs  = buildQuery(userInstitution, filtersSnapshot, pageNumber);
        const res = await fetch(`${API_BASE_URL}/api/hubclipps?${qs}`, { headers });
        const json = await res.json();
        const data = shuffleArray(json.data || []);

        setHubclipps((prev) => (replace ? data : [...prev, ...data]));
        pageRef.current = pageNumber;
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        console.error("useHubclipps fetch error:", err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [userInstitution, user]
  );

  // Re-fetch when institution changes (including on first mount)
  useEffect(() => {
    setHubclipps([]);
    pageRef.current = 0;
    setHasMore(true);
    fetchPage(0, true, filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInstitution]);

  // Re-fetch when filters change
  useEffect(() => {
    setHubclipps([]);
    pageRef.current = 0;
    setHasMore(true);
    fetchPage(0, true, filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const applyFilters = useCallback((newFilters) => setFilters(newFilters), []);
  const clearFilters = useCallback(() => setFilters(INITIAL_FILTERS), []);

  return {
    hubclipps,
    loading,
    hasMore,
    filters,
    applyFilters,
    clearFilters,
    loadMore: () => fetchPage(pageRef.current + 1, false, filters),
    refresh:  () => fetchPage(0, true, filters),
  };
};