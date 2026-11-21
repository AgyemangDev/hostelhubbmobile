// hooks/map/useMapPins.js
//
// Hostel and hubclip pins for the map, from GET /api/map/pins. If that call
// fails (offline, old backend), hostels fall back to the ones already cached
// on the phone, so the map is never empty.
import { useCallback, useContext, useEffect, useState } from "react";
import API_BASE_URL from "../../utils/api/api";
import { AccommodationContext } from "../../context/AccommodationContext";

const fromCache = (hostels = []) =>
  hostels
    .map((h) => ({
      id: h.id,
      name: h.hostelName,
      category: String(h.category || "hostel").toLowerCase(),
      latitude: Number(h.latitude),
      longitude: Number(h.longitude),
      image: h.frontImage || null,
      location: h.location || null,
      min_price: null,
      available: true,
    }))
    .filter((h) => Number.isFinite(h.latitude) && Number.isFinite(h.longitude) && h.latitude && h.longitude);

export default function useMapPins() {
  const { cachedHostels } = useContext(AccommodationContext);
  const [pins, setPins] = useState({ hostels: [], hubclips: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/map/pins`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not load the map.");
      setPins({ hostels: body.hostels || [], hubclips: body.hubclips || [] });
      setError(null);
    } catch (e) {
      setError(e.message);
      setPins((prev) => (prev.hostels.length ? prev : { hostels: fromCache(cachedHostels), hubclips: [] }));
    } finally {
      setLoading(false);
    }
  }, [cachedHostels]);

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...pins, loading, error, reload: load };
}
