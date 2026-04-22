import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

export default function ReservationButton({ onPress, price }) {
  const total = Math.round(price * 1.05);
  const formatted = total.toLocaleString("en-GH");

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: "#ff385c",
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#ff385c",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
      }}
    >
      <Text style={{ color: "white", fontWeight: "700", fontSize: 18, letterSpacing: 0.1 }}>
        GHS {formatted} · Make Reservation
      </Text>
    </TouchableOpacity>
  );
}