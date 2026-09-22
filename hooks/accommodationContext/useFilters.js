import { useState, useCallback, useMemo } from "react";

export const useFilters = (initialPrice = [0, 100000]) => {
  const [filters, setFiltersState] = useState({
    priceRange: initialPrice,
    institution: "",
    schoolId: "",
    locations: [],
    roomTypes: [],
    buildingTypes: [],
    amenities: [],
    rules: [],
    availableOnly: false,
  });

  const setFilters = useCallback((newFilters) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({
      priceRange: initialPrice,
      institution: "",
      schoolId: "",
      locations: [],
      roomTypes: [],
      buildingTypes: [],
      amenities: [],
      rules: [],
      availableOnly: false,
    });
  }, [initialPrice]);

  const applyFilters = useCallback(
    (accommodations) => {
      if (!accommodations || accommodations.length === 0) return [];

      const noRoomFilter = filters.roomTypes.length === 0;
      const noBuildingFilter = filters.buildingTypes.length === 0;
      const noAmenitiesFilter = filters.amenities.length === 0;
      const noLocationFilter = filters.locations.length === 0;
      const noRulesFilter = filters.rules.length === 0;
      const noInstitutionFilter = !filters.institution;

      const isDefaultPrice =
        filters.priceRange[0] === initialPrice[0] &&
        filters.priceRange[1] === initialPrice[1];

      const noFiltersActive =
        noRoomFilter &&
        noBuildingFilter &&
        noAmenitiesFilter &&
        noLocationFilter &&
        noRulesFilter &&
        noInstitutionFilter &&
        !filters.availableOnly &&
        isDefaultPrice;

      if (noFiltersActive) return accommodations;

      return accommodations.filter((acc) => {
        const accommodationInstitution = String(acc.institution || "").toLowerCase();
        const institutionOk =
          noInstitutionFilter ||
          accommodationInstitution === String(filters.institution).toLowerCase() ||
          String(acc.school_id || "").toLowerCase() === String(filters.schoolId || "").toLowerCase();
        const locationOk =
          noLocationFilter ||
          filters.locations.some((location) =>
            String(acc.location || "").toLowerCase() === String(location).toLowerCase()
          );
        const hasAvailableRoom = Array.isArray(acc.room_types) && acc.room_types.length > 0
          ? acc.room_types.some((room) => room.room_availability !== false && Number(room.rooms_available ?? 1) > 0)
          : acc.accommodation_availability === true;
        const availabilityOk = !filters.availableOnly || hasAvailableRoom;

        // --- PRICE + ROOM TYPE check ---
        // Use the joined room_types (array of objects from accommodation_room_types table)
        // which has { room_type, price, ... } shape.
        // Fall back to added_room_types (text[]) for room type name matching only.
        let priceOk = false;
        let roomOk = false;

        if (acc.room_types && acc.room_types.length > 0) {
          // ✅ room_types is the joined relation: [{ room_type: "Single", price: 5000, ... }]
          for (const room of acc.room_types) {
            const roomPrice = Number(room.price) || 0;
            const matchesPrice =
              roomPrice >= filters.priceRange[0] &&
              roomPrice <= filters.priceRange[1];

            const matchesRoomType =
              noRoomFilter || filters.roomTypes.includes(room.room_type);

            if (matchesPrice && matchesRoomType) {
              priceOk = true;
              roomOk = true;
              break;
            }
          }
        } else if (acc.added_room_types && acc.added_room_types.length > 0) {
          // Fallback: added_room_types is a text[] like ["Single", "Double"]
          // No price info here, so price check passes by default
          priceOk = isDefaultPrice; // only pass if no price filter is active
          roomOk =
            noRoomFilter ||
            acc.added_room_types.some((rt) => filters.roomTypes.includes(rt));
        } else {
          // No room info at all — use top-level price if it exists
          const topPrice = Number(acc.price) || 0;
          priceOk =
            topPrice >= filters.priceRange[0] &&
            topPrice <= filters.priceRange[1];
          roomOk = noRoomFilter; // can't match a room type if there's no data
        }

        // --- BUILDING TYPE check ---
        // Use acc.category as your building type, since your schema has no building_type column.
        // If you DO have a building_type column (added later), swap "category" for "building_type".
        const category = String(acc.category || "").toLowerCase();
        const normalizedCategory = category === "private hostel" ? "hostel"
          : category === "private homestel" ? "homestel"
          : category === "private apartment" || category === "appartment" ? "apartment"
          : category;
        const buildingOk =
          noBuildingFilter || filters.buildingTypes.includes(normalizedCategory);

        // --- AMENITIES check ---
        const amenitiesOk =
          noAmenitiesFilter ||
          filters.amenities.every((a) => acc.amenities?.includes(a));

        const rules = typeof acc.accommodation_rules === "string"
          ? (() => {
              try { return JSON.parse(acc.accommodation_rules); } catch { return {}; }
            })()
          : (acc.accommodation_rules || acc.rules || {});
        if (rules.visitors_allowed === undefined) {
          rules.visitors_allowed = rules.overnight_visitors_allowed;
        }
        if (rules.cooking_allowed === undefined && rules.cooking_in_rooms_not_allowed !== undefined) {
          rules.cooking_allowed = !rules.cooking_in_rooms_not_allowed;
        }
        const rulesOk =
          noRulesFilter || filters.rules.every((rule) => rules[rule] === true);

        return (
          priceOk &&
          roomOk &&
          buildingOk &&
          amenitiesOk &&
          institutionOk &&
          locationOk &&
          availabilityOk &&
          rulesOk
        );
      });
    },
    [filters]
  );

  return {
    filters,
    setFilters,
    clearFilters,
    applyFilters,
  };
};
