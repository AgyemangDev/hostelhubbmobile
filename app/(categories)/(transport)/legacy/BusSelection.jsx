import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import BusCard from "../../../../components/cards/transport/BusCard";
import BusCardSkeleton from "../../../../components/skeletons/transport/BusCardSkeleton";
import BusEmptyState from "../../../../components/feedback/transport/BusEmptyState";
import API_BASE_URL from "../../../../utils/api/api";
import locations from "../../../../assets/data/transport/location";
import { useRouter } from "expo-router";
import { Button, SelectField } from "../../../../components/ui";
import { colors } from "../../../../constants/theme";

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
    pathname: "/(categories)/(transport)/legacy/SeatSelection",
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
      <SelectField
        options={locations}
        value={pickup}
        onChange={(val) => setPickup(val)}
        placeholder="Select Pickup"
      />

      <Text style={styles.label}>Destination Point</Text>
      <SelectField
        options={locations}
        value={destination}
        onChange={(val) => setDestination(val)}
        placeholder="Select Destination"
      />

      <Button
        title="Search Available Buses"
        onPress={fetchBuses}
        style={{ marginVertical: 16 }}
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
  container: { flex: 1, backgroundColor: colors.surface },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
    color: colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
    color: colors.text,
  },
  error: { color: "red", marginTop: 4, fontWeight: "600", marginBottom: 8 },
});