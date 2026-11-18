import React from "react";
import { View } from "react-native";
import { Button, Card, Eyebrow, Text } from "../../ui";
import { space } from "../../../constants/theme";

/** The student's own referral code with a Share button. */
export default function MyReferralCodeCard({ code, onShare, caption = "Share it and earn 5% when friends pay." }) {
  return (
    <Card style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Eyebrow>YOUR CODE</Eyebrow>
        <Text variant="title" style={{ letterSpacing: 1 }}>{code}</Text>
        <Text variant="caption" tone="secondary">{caption}</Text>
      </View>
      <Button title="Share" icon="share-outline" variant="secondary" size="sm" onPress={onShare} />
    </Card>
  );
}
