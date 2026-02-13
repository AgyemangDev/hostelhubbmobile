// hooks/hubclippsContext/useHubclipps.js
import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../utils/api/api";

const PAGE_SIZE = 10;

const INITIAL_FILTERS = {
  institution: null,       // overrides the user's institution when set
  accommodationType: null, // maps to ?category=
  priceRange: null,        // [min, max]
  roomType: null,          // maps to ?room_type=
};

/**
 * Build the query-string fragment for the active filters.
 * Always includes the resolved institution (user's school unless the filter
 * overrides it).  Only appends keys that have a non-null value.
 */
const buildQuery = (userInstitution, filters, page) => {
  const institution = filters.institution ?? userInstitution;
  const params = new URLSearchParams({
    institution,
    page: String(page),
    pageSize: String(PAGE_SIZE),
  });

  if (filters.accommodationType) params.set("category",   filters.accommodationType);
  if (filters.roomType)          params.set("room_type",  filters.roomType);
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

  const [hubclipps, setHubclipps]   = useState([]);
  const [loading,   setLoading]     = useState(false);
  const [hasMore,   setHasMore]     = useState(true);
  const [filters,   setFilters]     = useState(INITIAL_FILTERS);

  const pageRef    = useRef(0);
  const loadingRef = useRef(false);

  // ─── Core fetcher ─────────────────────────────────────────────────────────
  // Takes a snapshot of `filters` at call-time so stale closures are never
  // an issue — callers that need to apply new filters should call
  // applyFilters() instead, which updates state then triggers this via effect.
  const fetchPage = useCallback(
    async (pageNumber = 0, replace = false, filtersSnapshot = filters) => {
      if (!userInstitution || !user || loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);

        const token = await user.getIdToken(false);
        const qs    = buildQuery(userInstitution, filtersSnapshot, pageNumber);

        const res  = await fetch(`${API_BASE_URL}/api/hubclipps?${qs}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        const data = json.data || [];

        setHubclipps((prev) => (replace ? data : [...prev, ...data]));
        pageRef.current = pageNumber;
        setHasMore(data.length === PAGE_SIZE);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userInstitution, user]
    // NOTE: `filters` is intentionally NOT a dependency here.
    // We pass a snapshot as an argument so we never need to recreate this fn.
  );

  // ─── Re-fetch when institution changes ────────────────────────────────────
  useEffect(() => {
    setHubclipps([]);
    pageRef.current = 0;
    setHasMore(true);
    // Pass current filters snapshot so the refetch respects active filters
    fetchPage(0, true, filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInstitution]); // intentionally omit fetchPage / filters

  // ─── Re-fetch when filters change ─────────────────────────────────────────
  useEffect(() => {
    setHubclipps([]);
    pageRef.current = 0;
    setHasMore(true);
    fetchPage(0, true, filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); // intentionally omit fetchPage

  // ─── Public API ───────────────────────────────────────────────────────────
  /**
   * Apply a new filter object and immediately refetch from page 0.
   * Replaces the entire filter state — pass a full object.
   */
  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    // The useEffect above will fire and trigger the fetch.
  }, []);

  const clearFilters = useCallback(() => {
    applyFilters(INITIAL_FILTERS);
  }, [applyFilters]);

  return {
    hubclipps,
    loading,
    hasMore,
    filters,
    applyFilters,
    clearFilters,
    loadMore:  () => fetchPage(pageRef.current + 1, false, filters),
    refresh:   () => fetchPage(0, true, filters),
  };
};