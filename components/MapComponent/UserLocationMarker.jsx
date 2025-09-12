import { AnimatedRegion, Marker as AnimatedMarker } from "react-native-maps";
import { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native"

const UserLocationMarker = ({ location }) => {
  const markerRef = useRef(null);
  const animatedCoordinate = useRef(
    new AnimatedRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  ).current;

  useEffect(() => {
    if (location) {
      animatedCoordinate.timing({
        latitude: location.latitude,
        longitude: location.longitude,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [location]);

  return (
    <AnimatedMarker.Animated
      ref={markerRef}
      coordinate={animatedCoordinate}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={styles.markerContainer}>
        <View style={styles.marker} />
        <View style={styles.pulse} />
      </View>
    </AnimatedMarker.Animated>
  );
};


const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4285F4",
    borderWidth: 3,
    borderColor: "white",
  },
  pulse: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(66, 133, 244, 0.2)",
  },
})

export default UserLocationMarker
