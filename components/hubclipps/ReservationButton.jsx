import React from "react";
import { TouchableOpacity, Text } from "react-native";

export default function ReservationButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#ff385c",
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 10,
      }}
    >
      <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
        Make Reservation
      </Text>
    </TouchableOpacity>
  );
}
