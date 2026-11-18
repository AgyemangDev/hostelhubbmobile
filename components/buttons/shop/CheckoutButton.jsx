import React from "react";
import { Button } from "../../ui";
import { money } from "../../../utils/formatMoney";
import { space } from "../../../constants/theme";

/** The cart's main action. */
export default function CheckoutButton({ onPress, text }) {
  return <Button title={text || `Proceed to Checkout (${money(0)})`} onPress={onPress} style={{ margin: space.md }} />;
}
