import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
import COLORS from "../../../constants/Colors";
import Button from "../../../components/ButtonComponents/ButtonComponent";
import CustomDropdown from "../../../components/Dropdowns/CustomDropdown";
import BusCard, { BusCardSkeleton, BusEmptyState } from "../../../components/Cards/transport/Buscard";
import { getLocations, searchTrips } from "../../../utils/api/transportUnigo";
import { useRouter } from "expo-router";

/**
 * Trips come from UniGo, and so do the pickup/destination options — UniGo's
 * endpoint labels are the ones its buses are actually stored under, so a
 * hardcoded local list would silently return zero results.
 */
const BusSelectionScreen = () => {
  const router = useRouter();

  const [locations, setLocations] = useState({ origins: [], destinations: [] });
  const [locationsError, setLocationsError] = useState("");
  const [loadingLocations, setLoadingLocations] = useState(true);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupVisible, setPickupVisible] = useState(false);
  const [destinationVisible, setDestinationVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [buses, setBuses] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getLocations();
        if (cancelled) return;
        setLocations({
          origins: data?.origins || [],
          destinations: data?.destinations || [],
        });
      } catch (err) {
        if (!cancelled) setLocationsError(err.message);
      } finally {
        if (!cancelled) setLoadingLocations(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const fetchBuses = useCallback(
    async ({ silent } = {}) => {
      if (!pickup || !destination) {
        setError("Please select both pickup and destination");
        return;
      }
      if (pickup === destination) {
        setError("Pickup and destination cannot be the same");
        return;
      }

      if (!silent) setLoading(true);
      setError("");

      try {
        const trips = await searchTrips({ from: pickup, to: destination });
        setBuses(trips);
      } catch (err) {
        setBuses([]);
        setError(err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setSearched(true);
      }
    },
    [pickup, destination]
  );

  const onRefresh = useCallback(() => {
    if (!searched) return;
    setRefreshing(true);
    fetchBuses({ silent: true });
  }, [searched, fetchBuses]);

  // Seat availability is only a snapshot; SeatSelection re-fetches the live map.
  const handleSelectBus = (bus) => {
    router.push({
      pathname: "/(categories)/(unigotransport)/SeatSelection",
      params: { bus: JSON.stringify(bus) },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.heading}>Select Your Route</Text>

      {locationsError ? (
        <Text style={styles.error}>{locationsError}</Text>
      ) : null}

      <Text style={styles.label}>Pickup Point</Text>
      <CustomDropdown
        data={locations.origins}
        selectedValue={pickup}
        onSelect={(val) => setPickup(val)}
        placeholder={loadingLocations ? "Loading routes…" : "Select Pickup"}
        visible={pickupVisible}
        onPress={() => setPickupVisible((prev) => !prev)}
      />

      <Text style={styles.label}>Destination Point</Text>
      <CustomDropdown
        data={locations.destinations}
        selectedValue={destination}
        onSelect={(val) => setDestination(val)}
        placeholder={loadingLocations ? "Loading routes…" : "Select Destination"}
        visible={destinationVisible}
        onPress={() => setDestinationVisible((prev) => !prev)}
      />

      <Button
        buttonText="Search Available Buses"
        onPressFunction={fetchBuses}
        customStyle={{ marginVertical: 16 }}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.subHeading}>Available Buses</Text>
          <BusCardSkeleton />
          <BusCardSkeleton />
          <BusCardSkeleton />
        </View>
      )}

      {!loading && searched && buses.length === 0 && !error && <BusEmptyState />}

      {!loading && buses.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.subHeading}>
            {buses.length} {buses.length === 1 ? "Bus" : "Buses"} Available
          </Text>
          {buses.map((bus) => (
            <BusCard key={bus.id} bus={bus} onSelect={handleSelectBus} />
          ))}
          <Text style={styles.poweredBy}>Buses and tickets provided by UniGo Transport</Text>
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
  error: { color: COLORS.error, marginTop: 4, fontWeight: "600", marginBottom: 8 },
  poweredBy: {
    fontSize: 12,
    color: COLORS.textFaint,
    textAlign: "center",
    marginTop: 8,
  },
});
