import React from "react";
import { StyleSheet, View } from "react-native";
import { Divider, StatusPill, Text } from "../../ui";
import { money } from "../../../utils/formatMoney";
import { space } from "../../../constants/theme";

const STATUS = {
  processing: { label: "Processing", tone: "warning" },
  success: { label: "Sent", tone: "success" },
  failed: { label: "Failed, refunded", tone: "danger" },
  reversed: { label: "Reversed, refunded", tone: "danger" },
};

const day = (iso) => new Date(iso).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" });

/** One past withdrawal: amount, date and bank, and its status. */
export default function WithdrawalRow({ withdrawal, first }) {
  const s = STATUS[withdrawal.status] || STATUS.processing;
  const bank = withdrawal.payout_snapshot?.bank_name;
  return (
    <View>
      {first ? null : <Divider />}
      <View style={styles.row}>
        <View style={{ gap: 2 }}>
          <Text variant="bodyStrong">{money(withdrawal.amount)}</Text>
          <Text variant="caption" tone="secondary">
            {day(withdrawal.created_at)}
            {bank ? ` · ${bank}` : ""}
          </Text>
        </View>
        <StatusPill label={s.label} tone={s.tone} style={{ alignSelf: "center" }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space.sm, paddingVertical: space.sm },
});
