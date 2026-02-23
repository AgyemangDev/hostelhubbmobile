import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Seat = ({ seat, isSelected, isBooked, onPress }) => {
  let bgColor = "#F0F4FF";
  let borderColor = "#C8D6FF";
  let textColor = "#5B7FE8";

  if (isBooked) {
    bgColor = "#FFE8E8";
    borderColor = "#FFBBBB";
    textColor = "#E05555";
  }

  if (isSelected) {
    bgColor = "#22C55E";
    borderColor = "#16A34A";
    textColor = "#fff";
  }

  return (
    <TouchableOpacity
      disabled={isBooked}
      onPress={() => onPress(seat)}
      activeOpacity={0.75}
      style={[styles.seat, { backgroundColor: bgColor, borderColor }]}
    >
      {isBooked ? (
        <Ionicons name="person" size={14} color={textColor} />
      ) : isSelected ? (
        <Ionicons name="checkmark" size={14} color={textColor} />
      ) : (
        <Text style={[styles.seatNumber, { color: textColor }]}>
          {seat.number}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Seat;

const styles = StyleSheet.create({
  seat: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  seatNumber: {
    fontSize: 12,
    fontWeight: "700",
  },
});