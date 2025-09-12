import React from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

const universityLocations = {
  KNUST: { latitude: 6.6744, longitude: -1.5714 },
  "KNUST Obuase": { latitude: 6.6744, longitude: -1.5714 },
  'University of Ghana': { latitude: 5.6400, longitude: -0.2050 },
  UCC: { latitude: 5.1073, longitude: -1.2470 },
  UNER: { latitude: 7.3492812, longitude: -2.3434304 },
  UMAT: { latitude: 6.7150, longitude: -2.3400 },
  'UoE Winneba': { latitude: 5.3640, longitude: -0.3025 },
};

const MapComponent = ({ selectedUniversity }) => {
  return (
    <MapView
      style={styles.map}
      region={{
        latitude: universityLocations[selectedUniversity].latitude,
        longitude: universityLocations[selectedUniversity].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      showsUserLocation={true}
    />
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  map: {
    width: '98%',
    height: '70%',
    marginLeft: 5,
    borderRadius: 20,
    marginTop: 4,
  },
});
