import React from "react";
import { ScreenHeader, money } from "../ui/ds";

/** Back button plus the trip: route on top, time and price per seat below. */
const BusHeader = ({ bus }) => {
  const route = bus?.route || {};
  const subtitle = [bus?.pickupDate, bus?.departureTime, bus?.price ? `${money(bus.price, { decimals: 0 })} a seat` : null]
    .filter(Boolean)
    .join(" · ");
  return <ScreenHeader title={route.from ? `${route.from} → ${route.to}` : bus?.name || "Pick your seats"} subtitle={subtitle} />;
};

export default BusHeader;
