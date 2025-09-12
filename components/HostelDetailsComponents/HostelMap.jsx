// HostelMap.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import HostelMarker from '../../assets/images/hostelmapicon.png';

const HostelMap = ({ latitude, longitude, hostelName, description, onViewLargerMap }) => (
  <View style={styles.mapContainer}>
    <MapView
      style={styles.map}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      showsUserLocation
    >
      <Marker
        coordinate={{ latitude, longitude }}
        title={hostelName}
        description={description}
      >
        <Image
          source={HostelMarker}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
      </Marker>
    </MapView>
    <TouchableOpacity style={styles.largerMapButton} onPress={onViewLargerMap}>
      <Ionicons name="compass" size={30} color="#fff" />
      <Text style={styles.largerMapText}>View on larger map</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  mapContainer: {
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  largerMapButton: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9a0b0d",
    borderRadius: 5,
    padding: 8,
    elevation: 3,
    zIndex: 1, 
  },
  largerMapText: {
    marginLeft: 5,
    color: "#fff",
  },
});

export default HostelMap;
