import { useState, useEffect, useRef, useContext } from "react";
import { StyleSheet, View, Dimensions, Modal } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { AccommodationContext } from "../../context/AccommodationContext";
import { UserContext } from "../../context/UserContext";
import ClientLogIn from "../(Client)/ClientLogIn";

import HostelMarkers from "../../components/MapComponent/HostelMarkers";
import UserLocationMarker from "../../components/MapComponent/UserLocationMarker";
import HostelModal from "../../components/MapComponent/HostelModal";
import CategoryTabs from "../../components/MapComponent/CategoryTabs";

const GHANA_REGION = {
  latitude: 7.9465,
  longitude: -1.0232,
  latitudeDelta: 8,
  longitudeDelta: 8,
};

const isInsideGhana = (latitude, longitude) =>
  latitude >= 4.5 &&
  latitude <= 11.5 &&
  longitude >= -3.5 &&
  longitude <= 1.5;

const MapScreen = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, userInfo } = useContext(UserContext);
  const [activeCategory, setActiveCategory] = useState("All");
  const { cachedHostels } = useContext(AccommodationContext);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const mapRef = useRef(null);
  const locationSubscription = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const filteredHostels =
    activeCategory === "All"
      ? cachedHostels
      : cachedHostels.filter(
          (item) =>
            item.category?.toLowerCase() === activeCategory.toLowerCase()
        );

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

  const handleMarkerPress = (hostel) => {
    if (!user || !userInfo) {
      setShowLoginModal(true);
      return;
    }
    setSelectedHostel(hostel);
  };

  const handleCloseModal = () => setSelectedHostel(null);
  const handleCategoryChange = (category) => setActiveCategory(category);

  const initialRegion =
    userLocation && isInsideGhana(userLocation.latitude, userLocation.longitude)
      ? {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0092,
          longitudeDelta: 0.0042,
        }
      : GHANA_REGION;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton
        showsCompass
        onMapReady={() => setMapReady(true)}
        zoomEnabled
        scrollEnabled
      >
        {userLocation && <UserLocationMarker location={userLocation} />}
        <HostelMarkers
          hostels={filteredHostels}
          onMarkerPress={handleMarkerPress}
        />
      </MapView>

      <View style={styles.tabsOverlay}>
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </View>

      {selectedHostel && (
        <HostelModal hostel={selectedHostel} onClose={handleCloseModal} />
      )}

      <Modal
        visible={showLoginModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <ClientLogIn onClose={() => setShowLoginModal(false)} />
      </Modal>
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