import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import COLORS from "../../constants/Colors";


const HostelInfo = ({ hostel, hostelDescription }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);


  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{hostel?.accommodation_name || "Hostel Name"}</Text>
      <Text style={styles.location}>
        Location: {hostel?.location || "Unknown"}
      </Text>

      <TouchableOpacity
        onPress={toggleDescription}
        style={styles.descriptionContainer}
      >
        <Text style={styles.description}>
          {showFullDescription
            ? hostelDescription
            : `${hostelDescription.slice(0, 60)}...`}
        </Text>
        <Ionicons
          name={
            showFullDescription ? "chevron-up-outline" : "chevron-down-outline"
          }
          size={20}
          color="#7f8c8d"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 4,
    color: COLORS.background,
  },
  location: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 12,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  distanceText: {
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 8,
    flex: 1,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#34495e",
    flex: 1,
  },
});

export default HostelInfo;
