import React from "react";
import { View } from "react-native";
import { Button, Card, Eyebrow, Text } from "../../ui";
import { space } from "../../../constants/theme";

/** The saved payout account, with a Change link. */
export default function PayoutAccountCard({ method, onChange }) {
  return (
    <Card style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Eyebrow>PAY OUT TO</Eyebrow>
        <Text variant="bodyStrong">{method.account_name}</Text>
        <Text variant="caption" tone="secondary">
          {method.bank_name} · {method.account_number}
        </Text>
      </View>
      <Button title="Change" variant="ghost" size="sm" onPress={onChange} />
    </Card>
  );
}
