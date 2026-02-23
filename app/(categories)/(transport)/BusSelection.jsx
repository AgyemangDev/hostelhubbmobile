import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import COLORS from "../../../constants/Colors";
import Button from "../../../components/ButtonComponents/ButtonComponent";
import CustomDropdown from "../../../components/Dropdowns/CustomDropdown";
import BusCard, { BusCardSkeleton, BusEmptyState } from "../../../components/Cards/transport/Buscard";
import API_BASE_URL from "../../../utils/api/api";
import locations from "../../../assets/data/transport/location";
import { useRouter } from "expo-router";

const BusSelectionScreen = () => {
    const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupVisible, setPickupVisible] = useState(false);
  const [destinationVisible, setDestinationVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(""); 

  const fetchBuses = async () => {
    if (!pickup || !destination) {
      setError("Please select both pickup and destination");
      return;
    }

    setLoading(true);
    setError("");
    setBuses([]);
    setSearched(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/transport/buses`, {
        pickup,
        destination,
      });
      if (response.data.success && response.data.buses.length) {
        setBuses(response.data.buses);
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

const handleSelectBus = (bus) => {
  router.push({
    pathname: "/(categories)/(transport)/SeatSelection",
    params: { bus: JSON.stringify(bus) },
  });
};

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <Text style={styles.heading}>Select Your Route</Text>

      <Text style={styles.label}>Pickup Point</Text>
      <CustomDropdown
        data={locations}
        selectedValue={pickup}
        onSelect={(val) => setPickup(val)}
        placeholder="Select Pickup"
        visible={pickupVisible}
        onPress={() => setPickupVisible((prev) => !prev)}
      />

      <Text style={styles.label}>Destination Point</Text>
      <CustomDropdown
        data={locations}
        selectedValue={destination}
        onSelect={(val) => setDestination(val)}
        placeholder="Select Destination"
        visible={destinationVisible}
        onPress={() => setDestinationVisible((prev) => !prev)}
      />

      <Button
        buttonText="Search Available Buses"
        onPressFunction={fetchBuses}
        customStyle={{ marginVertical: 16 }}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Shimmer skeletons while loading */}
      {loading && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.subHeading}>Available Buses</Text>
          <BusCardSkeleton />
          <BusCardSkeleton />
          <BusCardSkeleton />
        </View>
      )}

      {/* Results */}
      {!loading && searched && buses.length === 0 && !error && (
        <BusEmptyState />
      )}

      {!loading && buses.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.subHeading}>
            {buses.length} {buses.length === 1 ? "Bus" : "Buses"} Available
          </Text>
          {buses.map((bus) => (
            <BusCard key={bus.id} bus={bus} onSelect={handleSelectBus} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default BusSelectionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
    color: COLORS.textDark,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
    color: COLORS.textDark,
  },
  error: { color: "red", marginTop: 4, fontWeight: "600", marginBottom: 8 },
});