import React from "react";
import { Button, PriceBar } from "../../ui";
import { money } from "../../../utils/formatMoney";
import WaitlistButton from "../../buttons/accommodation/WaitlistButton";
import { space } from "../../../constants/theme";

/**
 * Bottom of the hostel page: the lowest yearly price on the left, Reserve on
 * the right. When every room is taken it offers the waitlist instead.
 */
export default function ReserveBar({ fromPrice, roomsLeft, fullyBooked, onReserve, accommodationId }) {
  const caption = fullyBooked
    ? "No rooms available right now"
    : roomsLeft && roomsLeft <= 5
    ? `a year · only ${roomsLeft} room${roomsLeft === 1 ? "" : "s"} left`
    : "a year";
  return (
    <PriceBar
      amount={fromPrice ? `From ${money(fromPrice, { decimals: 0 })}` : "Price on request"}
      caption={caption}
      action={fullyBooked && accommodationId ? <WaitlistButton accommodationId={accommodationId} /> : (
        <Button
          title={fullyBooked ? "Fully booked" : "Reserve"}
          onPress={onReserve}
          disabled={fullyBooked}
          style={{ paddingHorizontal: space.lg }}
        />
      )}
    />
  );
}
