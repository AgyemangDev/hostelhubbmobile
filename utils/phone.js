// WhatsApp numbers are stored as 0XXXXXXXXX (10 digits). Same rules as
// utils/ghanaPhone.js in the backend and normalize_gh_phone in the database.
//
//   "024 123 4567"      -> "0241234567"
//   "+233 24 123 4567"  -> "0241234567"
//   "233241234567"      -> "0241234567"
//   "00233241234567"    -> "0241234567"
//   "+233 0241234567"   -> "0241234567"
//   anything else       -> null
export function normalizeGhanaPhone(raw) {
  const n = String(raw ?? "").replace(/\D/g, "");
  if (/^0\d{9}$/.test(n)) return n;
  if (/^233\d{9}$/.test(n)) return `0${n.slice(3)}`;
  if (/^2330\d{9}$/.test(n)) return n.slice(3);
  if (/^00233\d{9}$/.test(n)) return `0${n.slice(5)}`;
  if (/^002330\d{9}$/.test(n)) return n.slice(5);
  return null;
}

export const isValidGhanaPhone = (raw) => normalizeGhanaPhone(raw) !== null;

export const WHATSAPP_ERROR = "Enter a valid WhatsApp number: 10 digits starting with 0, or +233 followed by 9 digits.";
export const WHATSAPP_HINT = "We'll use WhatsApp to reach you about your bookings and orders.";

/** Message for the field, or null when it's fine. */
export function whatsappError(raw) {
  if (!String(raw ?? "").trim()) return "Your WhatsApp number is required.";
  return isValidGhanaPhone(raw) ? null : WHATSAPP_ERROR;
}
