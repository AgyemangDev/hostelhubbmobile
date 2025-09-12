import { useState, useEffect, useRef,useContext } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { UserContext } from "../../context/UserContext";

import HostelMarkers from "../../components/MapComponent/HostelMarkers";
import UserLocationMarker from "../../components/MapComponent/UserLocationMarker";
import HostelModal from "../../components/MapComponent/HostelModal";
import DirectionsLine from "../../components/MapComponent/DirectionsLine";
import CategoryTabs from "../../components/MapComponent/CategoryTabs";
import { useHostels } from "../../context/HostelsContext";

const MapScreen = () => {
    const { userInfo } = useContext(UserContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const { hostels, loading } = useHostels();
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [currentRoutingHostel, setCurrentRoutingHostel] = useState(null);
  const mapRef = useRef(null);
  const locationSubscription = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const filteredHostels = activeCategory === 'All'
    ? hostels
    : hostels.filter((item) => item.category?.toLowerCase() === activeCategory.toLowerCase());

  // Initialize and track user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const initialUserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(initialUserLocation);

      // Set up continuous location tracking
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 0,
          distanceInterval: 0,
          mayShowUserSettingsDialog: true,
        },
        (newLocation) => {
          const updatedUserLocation = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
      
          setUserLocation(updatedUserLocation);
        }
      );
    })();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  const handleMarkerPress = (hostel) => {
    setSelectedHostel(hostel);
  };

  const handleCloseModal = () => {
    setSelectedHostel(null);
  };

  const handleDirectMe = () => {
    if (selectedHostel && userLocation) {
      setShowDirections(true);
      setCurrentRoutingHostel(selectedHostel);
    }
  };

  const handleStopDirections = () => {
    setShowDirections(false);
    setCurrentRoutingHostel(null);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0092,
            longitudeDelta: 0.0042,
          }}
          showsUserLocation={false}
          showsMyLocationButton={true}
          showsCompass={true}
          onMapReady={() => setMapReady(true)}
          zoomEnabled={true}
          scrollEnabled={true}
        >
          <UserLocationMarker location={userLocation} />
          <HostelMarkers hostels={filteredHostels} onMarkerPress={handleMarkerPress} />
          {showDirections && currentRoutingHostel && (
            <DirectionsLine
              origin={userLocation}
              destination={{
                latitude: currentRoutingHostel.latitude,
                longitude: currentRoutingHostel.longitude,
              }}
            />
          )}
        </MapView>
      )}

      {/* Category tabs overlay on the map */}
      <View style={styles.tabsOverlay}>
        <CategoryTabs 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
        />
      </View>

      {selectedHostel && (
        <HostelModal
          hostel={selectedHostel}
          onClose={handleCloseModal}
          onDirectMe={handleDirectMe}
          onRoute={() => console.log("Route button pressed")}
          showStopDirectionsButton={showDirections && currentRoutingHostel?.id === selectedHostel.id}
          onStopDirections={handleStopDirections}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  tabsOverlay: {
    position: 'absolute',
    top: 50, // Adjust based on your status bar height
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  }
});

export default MapScreen;