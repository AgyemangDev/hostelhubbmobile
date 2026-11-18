// Data rules shared by every listing card and listing screen.

const FEE_RATE = 0.05;
const CATEGORY = { hostel: "Hostel", homestel: "Homestel", apartment: "Apartment" };

/** Lowest yearly price students pay (room price + 5%) and rooms available. */
export function listingFacts(item) {
  const rooms = Array.isArray(item?.room_types) ? item.room_types : [];
  const prices = rooms.map((r) => Number(r.price)).filter((p) => Number.isFinite(p) && p > 0);
  const roomsLeft = rooms.reduce((n, r) => n + (Number(r.rooms_available) || 0), 0);
  return {
    fromPrice: prices.length ? Math.min(...prices) * (1 + FEE_RATE) : null,
    roomsLeft: rooms.length ? roomsLeft : null,
    rating: Number(item?.rating ?? item?.average_rating) || null,
    reviews: Number(item?.reviews_count ?? item?.review_count) || null,
  };
}

/** The availability tag shown on a listing photo, or null when unknown. */
export function availabilityTag(item, facts) {
  if (item.accommodation_availability === false || facts.roomsLeft === 0) return { label: "Fully booked", booked: true };
  if (facts.roomsLeft) return { label: `Room${facts.roomsLeft === 1 ? "" : "s"} available`, booked: false };
  if (item.accommodation_availability === true) return { label: "Available", booked: false };
  return null;
}

/** "Hostel in Ayeduase". */
export function listingPlace(item) {
  const category = CATEGORY[String(item.category || "").toLowerCase()] || null;
  return [category, item.location].filter(Boolean).join(" in ");
}

/** Up to 5 photos: the front photo, the hostel's gallery, then room photos. */
export function listingPhotos(item) {
  const all = [item.front_image, ...(item.images || []), ...(item.room_types || []).flatMap((r) => r.images || [])].filter(
    (u) => typeof u === "string" && u
  );
  return [...new Set(all)].slice(0, 5);
}
