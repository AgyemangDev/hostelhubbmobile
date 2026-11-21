// Small formatters for the map: price tags and distance from the student.

/** 4950 -> "GH₵4,950" */
export const priceTag = (value) =>
  value ? `GH₵${Math.round(Number(value)).toLocaleString("en-GH")}` : null;

/** Straight-line distance in km between two { latitude, longitude } points. */
export function distanceKm(a, b) {
  if (!a || !b) return null;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLng = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** 0.4 -> "400 m away", 3.27 -> "3.3 km away" */
export function distanceLabel(km) {
  if (km == null) return null;
  if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m away`;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km away`;
}
