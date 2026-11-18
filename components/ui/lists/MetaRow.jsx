import React from "react";
import { StyleSheet, View } from "react-native";
import Icon from "../icons/Icon";
import Text from "../typography/Text";
import { space } from "../../../constants/theme";

/**
 * Small icon + one line of detail inside a card ("📍 Ayeduase", "👤 Passenger: Ama").
 * tone: secondary (default) | default | inverse
 */
export default function MetaRow({ icon, label, tone = "secondary", numberOfLines = 1, style }) {
  return (
    <View style={[styles.row, style]}>
      {icon ? <Icon name={icon} size={15} tone={tone} /> : null}
      <Text variant="caption" tone={tone} numberOfLines={numberOfLines} style={styles.text}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  text: { flex: 1 },
});
