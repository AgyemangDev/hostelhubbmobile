import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function LeftInfo({ item }) {
  return (
    <View style={{ maxWidth: "75%" }}>
      <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
        {item.room_type} • {item.category}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialIcons name="location-on" color="white" />
        <Text style={{ color: "white" }}>
          {item.location} — {item.institution}
        </Text>
      </View>

      <Text style={{ color: "#ddd", marginTop:15 }}>
        Amenities: {item.amenities.join(", ")}
      </Text>
    </View>
  );
}
