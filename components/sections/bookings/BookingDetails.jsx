import React from "react";
import { Card, DetailRow, Eyebrow } from "../../ui";
import { space } from "../../../constants/theme";

const day = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** When the booking was made and where it stands. */
export default function BookingDetails({ booking_date, status }) {
  return (
    <Card style={{ gap: space.xxs }}>
      <Eyebrow style={{ marginBottom: space.xs }}>BOOKING DETAILS</Eyebrow>
      <DetailRow label="Booking date" value={booking_date ? day(booking_date) : null} />
      <DetailRow label="Status" value={status} valueStyle={{ textTransform: "capitalize" }} />
    </Card>
  );
}
