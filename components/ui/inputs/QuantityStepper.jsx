import React from "react";
import { StyleSheet, View } from "react-native";
import IconButton from "../buttons/IconButton";
import Text from "../typography/Text";

/** − 2 + quantity control, on Paper IconButtons. */
export default function QuantityStepper({ value, onIncrease, onDecrease, label = "item", min = 0, max }) {
  const atMax = max !== undefined && value >= max;
  return (
    <View style={styles.row}>
      <IconButton variant="outlined" icon="remove" size={18} onPress={onDecrease} disabled={value <= min} accessibilityLabel={`Remove one ${label}`} />
      <Text variant="bodyStrong" style={styles.value} accessibilityLiveRegion="polite">
        {value}
      </Text>
      <IconButton variant="outlined" icon="add" size={18} onPress={onIncrease} disabled={atMax} accessibilityLabel={`Add one ${label}`} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  value: { minWidth: 28, textAlign: "center", fontWeight: "800" },
});
