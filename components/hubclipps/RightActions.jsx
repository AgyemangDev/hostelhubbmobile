import React from "react";
import { View, Text, Image } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function RightActions({ frontImage, views }) {
  return (
    <View style={{ alignItems: "center", gap: 20 }}>
      <Image
        source={{ uri: frontImage }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          borderWidth: 2,
          borderColor: "#fff",
        }}
      />

      <View>
        <Feather name="eye" size={28} color="white" />
        <Text style={{ color: "white", textAlign: "center" }}>{views}</Text>
      </View>
    </View>
  );
}