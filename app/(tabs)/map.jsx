import { useState, useEffect, useRef, useContext } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { AccommodationContext } from "../../context/AccommodationContext";

import HostelMarkers from "../../components/MapComponent/HostelMarkers";
import UserLocationMarker from "../../components/MapComponent/UserLocationMarker";
import HostelModal from "../../components/MapComponent/HostelModal";
import CategoryTabs from "../../components/MapComponent/CategoryTabs";

const MapScreen = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { cachedHostels } = useContext(AccommodationContext);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const mapRef = useRef(null);
  const locationSubscription = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Filter cached hostels by category
  const filteredHostels =
    activeCategory === "All"
      ? cachedHostels
      : cachedHostels.filter(
          (item) =>
            item.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  // Initialize and track user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 0,
          distanceInterval: 0,
          mayShowUserSettingsDialog: true,
        },
        (newLocation) => {
          setUserLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          });
        }
      );
    })();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  // Log cache info for debugging
  useEffect(() => {
    console.log('🗺️ Map using cached hostels:', {
      total: cachedHostels.length,
      filtered: filteredHostels.length,
      category: activeCategory
    });
  }, [cachedHostels, filteredHostels, activeCategory]);

  const handleMarkerPress = (hostel) => {
    setSelectedHostel(hostel);
  };

  const handleCloseModal = () => {
    setSelectedHostel(null);
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
          showsMyLocationButton
          showsCompass
          onMapReady={() => setMapReady(true)}
          zoomEnabled
          scrollEnabled
        >
          <UserLocationMarker location={userLocation} />
          <HostelMarkers
            hostels={filteredHostels}
            onMarkerPress={handleMarkerPress}
          />
        </MapView>
      )}

      {/* Category tabs overlay */}
      {/* <View style={styles.tabsOverlay}>
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </View> */}

      {selectedHostel && (
        <HostelModal
          hostel={selectedHostel}
          onClose={handleCloseModal}
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
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  },
});

export default MapScreen;