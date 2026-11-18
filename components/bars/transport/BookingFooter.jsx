import React from "react";
import { Button, PriceBar } from "../../ui";
import { money } from "../../../utils/formatMoney";
import { space } from "../../../constants/theme";

/** Total and Continue, pinned under the seat map. */
const BookingFooter = ({ selectedSeats, totalPrice, onContinue }) => {
  const n = selectedSeats.length;
  return (
    <PriceBar
      amount={money(totalPrice, { decimals: 0 })}
      caption={n ? `Seat${n > 1 ? "s" : ""} ${selectedSeats.map((s) => s.number).join(", ")}` : "Tap a seat to pick it"}
      action={<Button title="Continue" onPress={onContinue} disabled={!n} style={{ paddingHorizontal: space.xl }} />}
    />
  );
};

export default BookingFooter;
