import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BusCard, { BusCardSkeleton, BusEmptyState } from "../../../../components/transport/cards/Buscard";
import { getLocations, searchTrips } from "../../../../utils/api/transportUnigo";
import { auth } from "../../../../lib/firebase/FirebaseConfig";
import ClientLogIn from "../../../(Client)/ClientLogIn";
import { Button, Chip, FadeIn, IconButton, Notice, ScreenHeader, SelectField } from "../../../../components/ui/ds";
import { colors, radius, space, type } from "../../../../constants/theme";

const isoDay = (d) => d.toISOString().split("T")[0];
const nextDays = (n) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      value: isoDay(d),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-GH", { weekday: "short", day: "numeric", month: "short" }),
    };
  });

/**
 * Bus search. Routes and trips come from UniGo: its location labels are the
 * ones buses are stored under, so a hardcoded list would return nothing.
 * Searching is open to everyone; picking a bus asks for login.
 */
export default function BusSearch() {
  const router = useRouter();
  const days = useMemo(() => nextDays(5), []);

  const [locations, setLocations] = useState({ origins: [], destinations: [] });
  const [locationsError, setLocationsError] = useState("");
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(null); // null = any day

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [buses, setBuses] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [pendingBus, setPendingBus] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getLocations()
      .then((data) => !cancelled && setLocations({ origins: data?.origins || [], destinations: data?.destinations || [] }))
      .catch((err) => !cancelled && setLocationsError(err.message))
      .finally(() => !cancelled && setLoadingLocations(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchBuses = useCallback(
    async ({ silent } = {}) => {
      if (!pickup || !destination) return setError("Choose where you're leaving from and going to.");
      if (pickup === destination) return setError("Pickup and destination can't be the same.");
      if (!silent) setLoading(true);
      setError("");
      try {
        setBuses(await searchTrips({ from: pickup, to: destination, date: date || undefined }));
      } catch (err) {
        setBuses([]);
        setError(err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setSearched(true);
      }
    },
    [pickup, destination, date]
  );

  // Re-run the search when the day changes after a first search.
  useEffect(() => {
    if (searched) fetchBuses();
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  const openBus = (bus) =>
    router.push({ pathname: "/(categories)/(transport)/unigo/SeatSelection", params: { bus: JSON.stringify(bus) } });

  const handleSelectBus = (bus) => {
    if (!auth.currentUser) {
      setPendingBus(bus);
      return;
    }
    openBus(bus);
  };

  const swap = () => {
    setPickup(destination);
    setDestination(pickup);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => searched && (setRefreshing(true), fetchBuses({ silent: true }))} tintColor={colors.brand} />}
      >
        <Text style={type.display} accessibilityRole="header">Where are you heading?</Text>

        {locationsError ? <Notice tone="danger">{locationsError}</Notice> : null}

        <View style={styles.route}>
          <View style={{ flex: 1, gap: space.sm }}>
            <SelectField
              label="From"
              sheetTitle="Leaving from"
              placeholder={loadingLocations ? "Loading routes…" : "Choose pickup"}
              value={pickup}
              options={locations.origins}
              onChange={setPickup}
              disabled={loadingLocations}
            />
            <SelectField
              label="To"
              sheetTitle="Going to"
              placeholder={loadingLocations ? "Loading routes…" : "Choose destination"}
              value={destination}
              options={locations.destinations}
              onChange={setDestination}
              disabled={loadingLocations}
            />
          </View>
          <IconButton icon="swap-vertical" accessibilityLabel="Swap from and to" onPress={swap} style={styles.swap} size={20} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.xs }}>
          <Chip label="Any day" selected={!date} onPress={() => setDate(null)} />
          {days.map((d) => (
            <Chip key={d.value} label={d.label} selected={date === d.value} onPress={() => setDate(d.value)} />
          ))}
        </ScrollView>

        <Button title="Search buses" icon="search" onPress={() => fetchBuses()} loading={loading && !searched} />

        {error ? <Notice tone="danger">{error}</Notice> : null}

        {loading ? (
          <View style={{ gap: space.sm }}>
            <BusCardSkeleton />
            <BusCardSkeleton />
            <BusCardSkeleton />
          </View>
        ) : searched && !error && buses.length === 0 ? (
          <BusEmptyState />
        ) : buses.length > 0 ? (
          <FadeIn style={{ gap: space.sm }}>
            <Text style={type.bodyStrong}>
              {buses.length} bus{buses.length === 1 ? "" : "es"}{date ? ` on ${days.find((d) => d.value === date)?.label}` : ""}
            </Text>
            {buses.map((bus) => (
              <BusCard key={bus.id} bus={bus} onSelect={handleSelectBus} />
            ))}
            <View style={styles.powered}>
              <Ionicons name="shield-checkmark-outline" size={14} color={colors.textSecondary} />
              <Text style={[type.caption, { color: colors.textSecondary }]}>Buses and tickets by UniGo Transport</Text>
            </View>
          </FadeIn>
        ) : null}
      </ScrollView>

      <Modal visible={Boolean(pendingBus)} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setPendingBus(null)}>
        <ClientLogIn
          onClose={() => {
            const bus = pendingBus;
            setPendingBus(null);
            if (bus && auth.currentUser) openBus(bus);
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, paddingTop: 0, gap: space.lg, paddingBottom: space.xxxl },
  route: { flexDirection: "row", alignItems: "center", gap: space.xs },
  swap: { borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.pill, marginTop: 20 },
  powered: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: space.xs },
});
