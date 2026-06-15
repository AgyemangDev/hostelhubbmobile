import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const HostelInfo = ({ hostel, hostelDescription }) => {
  const [expanded, setExpanded] = useState(false);

  const shortDescription =
    hostelDescription?.length > 100
      ? hostelDescription.slice(0, 100)
      : hostelDescription;

  return (
    <View style={styles.container}>
      {/* Hostel Name */}
      <Text style={styles.title}>
        {hostel?.accommodation_name || "Hostel Name"}
      </Text>

      {/* Location */}
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color="#717171" />
        <Text style={styles.location}>
          {hostel?.location || "Unknown location"}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Description */}
      <Text style={styles.description}>
        {expanded ? hostelDescription : shortDescription}
        {!expanded && hostelDescription?.length > 100 && "..."}
      </Text>

      {/* Toggle */}
      {hostelDescription?.length > 100 && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.showMore}>
            {expanded ? "Show less" : "Show more"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 4,
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 8,
    letterSpacing: -0.4,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  location: {
    fontSize: 15,
    color: "#717171",
    marginLeft: 6,
    fontWeight: "400",
  },

  divider: {
    height: 1,
    backgroundColor: "#EBEBEB",
    marginBottom: 18,
  },

  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#484848",
    marginBottom: 12,
  },

  showMore: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222222",
    textDecorationLine: "underline",
  },
});

export default HostelInfo;