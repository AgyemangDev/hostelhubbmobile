import React from "react";
import { Card, DetailRow, Eyebrow } from "../../ui";
import { money } from "../../../utils/formatMoney";
import { space } from "../../../constants/theme";

/** What the student pays now. Paystack is the only payment path, so it's one line. */
export default function AmountSection({ amount }) {
  return (
    <Card style={{ gap: space.xxs }}>
      <Eyebrow style={{ marginBottom: space.xs }}>AMOUNT DUE</Eyebrow>
      <DetailRow variant="total" label="Total" value={money(amount)} />
    </Card>
  );
}
