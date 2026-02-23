import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { formatPrice } from "../../assets/data/itemData";

// Dynamic icon getter that accepts color
// Dynamic icon getter that accepts color
const getIconForCategory = (category, color = "#4A6FA5") => {
  let size = 24;

  // Adjust size based on item name
  if (category.includes("Big")) size = 32;
  else if (category.includes("Medium")) size = 26;
  else if (category.includes("Small")) size = 20;

  // Check for fridge categories
if (category.includes("Fridge")) {
  if (category.includes("Double")) {
    return <MaterialCommunityIcons name="fridge-outline" size={size} color={color} />; // double-door
  } else {
    return <MaterialCommunityIcons name="fridge-top" size={size} color={color} />; // single-door
  }
}

  switch (category) {
    case "Luggage (Big)":
    case "Luggage (Medium)":
    case "Luggage (Small)":
      return <FontAwesome5 name="suitcase-rolling" size={size} color={color} />;
    case "Big Jute Bag":
    case "Medium Jute Bag":
    case "Small Jute Bag":
      return <Entypo name="shopping-bag" size={size} color={color} />;
    case "Rice Cooker":
      return <MaterialCommunityIcons name="pot-steam-outline" size={size} color={color} />;
    case "Iron":
      return <MaterialCommunityIcons name="iron" size={size} color={color} />;
    case "Hot Plate":
      return <MaterialCommunityIcons name="stove" size={size} color={color} />;
    case "Micro Oven":
      return <MaterialCommunityIcons name="microwave" size={size} color={color} />;
    default:
      return <MaterialCommunityIcons name="cube-outline" size={size} color={color} />;
  }
};



const CategoryItem = ({ category, price, onPress, selected }) => {
  const bgColor = selected ? "#e0e7ff" : "#f9fafb";
  const textColor = selected ? "#1e3a8a" : "#374151";
  const iconColor = selected ? "#1e3a8a" : "#4A6FA5";

  return (
    <TouchableOpacity
      style={[styles.categoryItem, { backgroundColor: bgColor, borderColor: selected ? "#4338ca" : "#e5e7eb" }]}
      onPress={() => onPress(category)}
    >
      <View style={styles.categoryContent}>
        <View style={styles.iconContainer}>{getIconForCategory(category, iconColor)}</View>
        <Text style={[styles.categoryName, { color: textColor }]}>{category}</Text>
        <View style={styles.priceTag}>
          <Text style={styles.categoryPrice}>GH₵ {formatPrice(price)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  categoryItem: {
    width: "31.9%",
    minHeight: 120,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    padding: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  categoryContent: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 8,
  },
  priceTag: {
    backgroundColor: "#eef2ff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  categoryPrice: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4338ca",
  },
});
