import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const CATEGORY_LABELS = {
  hostel: "Hostel",
  homestel: "Homestel",
  apartment: "Apartment",
};

function CategoryTag({ category }) {
  const label =
    CATEGORY_LABELS[category?.toLowerCase()] ||
    category?.charAt(0).toUpperCase() + category?.slice(1);

  const tagColors = {
    hostel: { bg: "rgba(255,180,0,0.25)", border: "#FFB400", text: "#FFD966" },
    homestel: { bg: "rgba(100,200,150,0.25)", border: "#64C896", text: "#90DEB8" },
    apartment: { bg: "rgba(100,160,255,0.25)", border: "#64A0FF", text: "#99C0FF" },
  };

  const colors = tagColors[category?.toLowerCase()] || {
    bg: "rgba(255,255,255,0.15)",
    border: "rgba(255,255,255,0.4)",
    text: "#fff",
  };

  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: colors.bg,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 11, fontWeight: "700", letterSpacing: 0.5 }}>
        {label}
      </Text>
    </View>
  );
}

function AmenitiesList({ amenities }) {
  const [expanded, setExpanded] = useState(false);

  const preview = amenities.slice(0, 6).join(" · ");
  const full = amenities.join(" · ");

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => setExpanded(!expanded)} style={{ marginTop: 10 }}>
      <Text
        style={{ color: "#fff", fontSize: 12, lineHeight: 18 }}
        numberOfLines={expanded ? undefined : 3}
      >
        {amenities.join(" · ")}
      </Text>
      <Text style={{ color: "#aaa", fontSize: 11, marginTop: 3, fontStyle: "italic" }}>
        {expanded ? "Show less ↑" : "Show more ↓"}
      </Text>
    </TouchableOpacity>
  );
}

export default function LeftInfo({ item }) {
  return (
    <View style={{ maxWidth: "75%" }}>
     

<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  }}
>
  <Text
    style={{
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      marginRight: 8,
    }}
  >
    {item.room_type}
  </Text>

  <CategoryTag category={item.category} />
</View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
        <MaterialIcons name="location-on" color="white" size={14} />
        <Text style={{ color: "white", fontSize: 13, marginLeft: 2 }}>
          {item.location} — {item.institution}
        </Text>
      </View>

      <AmenitiesList amenities={item.amenities} />
    </View>
  );
}