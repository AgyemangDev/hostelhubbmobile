import React from "react";
import { StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PressableScale } from "../../ui";
import { colors } from "../../../constants/theme";

/** A seat: outlined when free, ink when yours, grey when taken. */
const Seat = ({ seat, isSelected, isBooked, onPress }) => (
  <PressableScale
    disabled={isBooked}
    onPress={() => onPress(seat)}
    accessibilityRole="button"
    accessibilityLabel={`Seat ${seat.number}, ${isBooked ? "taken" : isSelected ? "selected" : "free"}`}
    accessibilityState={{ selected: isSelected, disabled: isBooked }}
    style={[styles.seat, isBooked ? styles.taken : isSelected ? styles.selected : styles.free]}
  >
    {isSelected ? (
      <Ionicons name="checkmark" size={16} color={colors.textInverse} />
    ) : isBooked ? null : (
      <Text style={styles.number}>{seat.number}</Text>
    )}
  </PressableScale>
);

export default Seat;

const styles = StyleSheet.create({
  seat: { width: 42, height: 42, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  free: { borderWidth: 1.5, borderColor: colors.borderStrong, backgroundColor: colors.surface },
  selected: { backgroundColor: colors.text },
  taken: { backgroundColor: colors.border },
  number: { fontSize: 12, fontWeight: "700", color: colors.text },
});
