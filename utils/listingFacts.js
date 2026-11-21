// Data rules shared by every listing card and listing screen.

const FEE_RATE = 0.05;
const CATEGORY = { hostel: "Hostel", homestel: "Homestel", apartment: "Apartment", hotel: "Hotel", "guest house": "Guest house" };

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

/**
 * "Hostel in Bomso, KNUST": the kind of place, the area (first part of the
 * location, so "Bomso, Kumasi" reads "Bomso"), then the school.
 */
export function listingPlace(item) {
  const category = CATEGORY[String(item.category || "").toLowerCase()] || null;
  const area = String(item.location || "").split(",")[0].trim();
  const where = [area, item.institution].filter(Boolean).join(", ");
  if (category && where) return `${category} in ${where}`;
  return category || where;
}

const compact = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k` : String(n));

/**
 * A short line on how much interest a place gets, from its view count, with
 * "Only N rooms left" when it's nearly full.
 *   { icon, label, count, hot }  shown as "Popular, viewed 5.7k times".
 *   hot: shown in the brand colour.
 */
export function listingInterest(item, facts = listingFacts(item)) {
  const views = Number(item?.views) || 0;
  const left = facts.roomsLeft;
  const scarce = left > 0 && left <= 3 ? `Only ${left} room${left === 1 ? "" : "s"} left` : null;

  const count = views >= 200 ? `${compact(views)} views` : null;
  if (scarce) return { icon: "alert-circle-outline", label: scarce, count: views >= 1000 ? count : null, hot: true };
  if (views >= 10000) return { icon: "flame", label: "In high demand", count, hot: true };
  if (views >= 3500) return { icon: "flame-outline", label: "Popular", count, hot: true };
  if (views >= 1000) return { icon: "eye-outline", label: `${compact(views)} views`, count: null, hot: false };
  if (views >= 200) return { icon: "trending-up-outline", label: "Getting noticed", count, hot: false };
  return { icon: "sparkles-outline", label: "New on HostelHubb", count: null, hot: false };
}

/** Up to 5 photos: the front photo, the hostel's gallery, then room photos. */
export function listingPhotos(item) {
  const all = [item.front_image, ...(item.images || []), ...(item.room_types || []).flatMap((r) => r.images || [])].filter(
    (u) => typeof u === "string" && u
  );
  return [...new Set(all)].slice(0, 5);
}
