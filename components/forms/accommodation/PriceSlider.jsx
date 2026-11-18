import React, { useContext } from "react";
import { RangeSlider } from "../../ui";
import { AccommodationContext } from "../../../context/AccommodationContext";
import { money } from "../../../utils/formatMoney";

/** Yearly price range filter for hostel search. */
export default function PriceSlider() {
  const { filters, setFilters } = useContext(AccommodationContext);
  return (
    <RangeSlider
      label="Price range"
      value={filters.priceRange}
      onChange={(v) => setFilters({ priceRange: v })}
      min={2000}
      max={30000}
      step={500}
      format={(n) => money(n, { decimals: 0 })}
    />
  );
}
