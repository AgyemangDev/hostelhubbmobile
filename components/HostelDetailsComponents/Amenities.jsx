import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const renderIcon = (amenity) => {
  // Consistent icon color that matches the app's theme
  const color = "#2980b9";

  switch (amenity.toLowerCase()) {
    case "water supply":
      return <Ionicons name="water-outline" size={20} color={color} />;
    case "wardrobe":
      return <Ionicons name="shirt-outline" size={20} color={color} />;
    case "shared kitchen":
      return <Ionicons name="restaurant-outline" size={20} color={color} />;
    case "balcony/kitchen":
      return <Ionicons name="home-outline" size={20} color={color} />;
    case "shared bathroom":
      return <MaterialCommunityIcons name="shower" size={20} color={color} />;
    case "private bathroom":
      return (
        <MaterialCommunityIcons
          name="bathtub-outline"
          size={20}
          color={color}
        />
      );
    case "wifi services":
      return <Ionicons name="wifi-outline" size={20} color={color} />;
    case "generators/plants":
      return (
        <Ionicons name="battery-charging-outline" size={20} color={color} />
      );
    case "dry lines":
      return <Ionicons name="sunny-outline" size={20} color={color} />;
    case "study rooms":
    case "table & chair":
      return <Ionicons name="book-outline" size={20} color={color} />;
    case "security":
    case "cctv camera":
      return (
        <Ionicons name="shield-checkmark-outline" size={20} color={color} />
      );
    case "ac":
      return <Ionicons name="snow-outline" size={20} color={color} />;
    case "water heater":
      return <Ionicons name="thermometer-outline" size={20} color={color} />;
    case "swimming pool":
      return <Ionicons name="water-outline" size={20} color={color} />;
    case "basketball court":
      return <Ionicons name="basketball-outline" size={20} color={color} />;
    case "gym":
      return <Ionicons name="barbell-outline" size={20} color={color} />;
    case "game/tv room":
    case "television":
      return <Ionicons name="tv-outline" size={20} color={color} />;
    case "fridge":
      return <Ionicons name="thermometer-outline" size={20} color={color} />;
    case "salon":
      return <Ionicons name="cut-outline" size={20} color={color} />;
    case "restaurant":
    case "eatery":
      return <Ionicons name="fast-food-outline" size={20} color={color} />;
    case "laundry":
    case "washing machine":
      return <Ionicons name="shirt-outline" size={20} color={color} />;
    case "football pitch":
      return <Ionicons name="football-outline" size={20} color={color} />;
    case "hostel shuttle":
      return <Ionicons name="bus-outline" size={20} color={color} />;
    case "bunk beds":
    case "single beds":
      return <Ionicons name="bed-outline" size={20} color={color} />;
    case "gas cooker":
      return <Ionicons name="flame-outline" size={20} color={color} />;
    case "fenced wall":
      return <Ionicons name="home-outline" size={20} color={color} />;
    default:
      return <Ionicons name="help-outline" size={20} color={color} />;
  }
};

const Amenities = ({ amenities }) => (
  <View style={styles.container}>
    <Text style={styles.sectionTitle}>Amenities</Text>
    <View style={styles.cardContainer}>
      <View style={styles.amenitiesContainer}>
        {amenities.map((amenity, index) => (
          <View key={index} style={styles.amenityItem}>
            <View style={styles.iconContainer}>{renderIcon(amenity)}</View>
            <Text style={styles.amenityText} numberOfLines={1}>
              {amenity}
            </Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#2c3e50",
    paddingLeft: 2,
  },
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 16,
    paddingRight: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f9ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  amenityText: {
    flex: 1,
    fontSize: 14,
    color: "#34495e",
    fontWeight: "500",
  },
});

export default Amenities;
