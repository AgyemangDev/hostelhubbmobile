import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import COLORS from "../../constants/Colors";

const GOOGLE_MAPS_APIKEY = "AIzaSyAbLuhuszsrZAUNH31HH3pc1T9P7rl9UHM";

const HostelInfo = ({ hostel, hostelDescription }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [walkingDistance, setWalkingDistance] = useState(null);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  /*
  // ====== Walking Distance Fetching (Commented Out) ======
  useEffect(() => {
    if (hostel?.institution?.toLowerCase() === "knust") {
      const fetchWalkingDistance = async () => {
        try {
          const response = await axios.get(
            "https://maps.googleapis.com/maps/api/distancematrix/json",
            {
              params: {
                origins: `${hostel.latitude},${hostel.longitude}`,
                destinations: `6.675074,-1.570825`,
                mode: "walking",
                key: GOOGLE_MAPS_APIKEY,
              },
            }
          );

          console.log("API Response:", JSON.stringify(response.data, null, 2));  

          const rows = response.data.rows;
          if (rows && rows[0] && rows[0].elements && rows[0].elements[0]) {
            const distanceText = rows[0].elements[0].distance?.text;

            if (distanceText) {
              const distanceMatch = distanceText.match(/([\d.]+)\s*km/);
              const distanceKm = distanceMatch ? parseFloat(distanceMatch[1]) : null;

              if (distanceKm !== null) {
                const walkingSpeedKmPerHour = 15; // Average walking speed
                const timeInMinutes = Math.round((distanceKm / walkingSpeedKmPerHour) * 60);

                setWalkingDistance({
                  distance: distanceText,
                  duration: `${timeInMinutes} mins`,
                });
              }
            }
          }
        } catch (error) {
          console.error("Error fetching walking distance:", error);
        }
      };

      fetchWalkingDistance();
    }
  }, [hostel]);
  // ====== End of Distance Fetching ======
  */

  /*
  // Optional distance info alert (also commented)
  const showDistanceInfo = () => {
    Alert.alert(
      "Walking Distance",
      "The distance is calculated from the hostels to the heart of KNUST campus, not the medical school. All hostels located around medical village is close. Thank you"
    );
  };
  */

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{hostel?.hostelName || "Hostel Name"}</Text>
      <Text style={styles.location}>
        Location: {hostel?.location || "Unknown"}
      </Text>

      {/* 
      {walkingDistance && (
        <View style={styles.distanceContainer}>
          <MaterialCommunityIcons
            name="walk"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.distanceText}>
            Walking Distance: {walkingDistance.distance} ({walkingDistance.duration})
          </Text>
          <TouchableOpacity onPress={showDistanceInfo}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      )}
      */}

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
