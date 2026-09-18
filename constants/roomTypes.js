// Single shared source of truth for room-type values across the app.
// Values are the canonical, compact strings stored in the database
// (e.g. "1 in 1"), which already match the display labels 1:1 —
// so no PascalCase-to-words formatting is needed anywhere downstream.
import { roomTypes } from "../assets/data/data";

export { roomTypes };

export const ROOM_TYPE_VALUES = roomTypes.map((r) => r.value);

// Apartment-first ordering used by components that surface Apartment
// ahead of the shared-room tiers.
export const ROOM_TYPE_DISPLAY_ORDER = ["Apartment", "1 in 1", "2 in 1", "3 in 1", "4 in 1"];
