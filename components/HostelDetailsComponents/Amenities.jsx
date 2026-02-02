import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAmenityIcon } from "../../assets/icons/amenityIcons";

const INITIAL_DISPLAY_COUNT = 5;

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Amenities = ({ amenities }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedAmenities = showAll
    ? amenities
    : amenities.slice(0, INITIAL_DISPLAY_COUNT);

  const handleShowAll = () => {
    // Smooth expand animation (fade + slide)
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        300,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );

    setShowAll(true);
  };

  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>What this place offers</Text>

      <View style={styles.amenitiesContainer}>
        {displayedAmenities.map((amenity, index) => (
          <View key={index} style={styles.amenityItem}>
            <View style={styles.iconContainer}>
              {getAmenityIcon(amenity)}
            </View>
            <Text style={styles.amenityText} numberOfLines={1}>
              {amenity}
            </Text>
          </View>
        ))}
      </View>

      {!showAll && amenities.length > INITIAL_DISPLAY_COUNT && (
        <TouchableOpacity
          style={styles.showAllButton}
          onPress={handleShowAll}
          activeOpacity={0.7}
        >
          <Text style={styles.showAllText}>
            Show all {amenities.length} amenities
          </Text>
          <Ionicons name="chevron-down" size={18} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Amenities;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  amenitiesContainer: {
    gap: 0,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  amenityText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  showAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 16,
    gap: 6,
  },
  showAllText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
});