import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import BusHeader from "../../../../components/headers/transport/BusHeader";
import SeatLegend from "../../../../components/seats/transport/SeatLegend";
import BusLayout from "../../../../components/seats/transport/BusLayout";
import SeatSelectionSkeleton from "../../../../components/skeletons/transport/SeatSelectionSkeleton";
import BookingFooter from "../../../../components/bars/transport/BookingFooter";
import { Button, EmptyState } from "../../../../components/ui";
import { getSeats } from "../../../../utils/api/transportUnigo";
import { colors } from "../../../../constants/theme";

/** Booking more than this in one payment gets unwieldy, and UniGo caps it too. */
const MAX_SEATS = 10;

const SeatSelection = () => {
  // `bus` (JSON) when coming from the search results; `tripId` alone when
  // opened from a shared link (/transport/trips/:tripId). Either way the trip
  // and seats are fetched fresh below.
  const { bus: busParam, tripId } = useLocalSearchParams();
  const router = useRouter();

  const [bus, setBus] = useState(() => {
    try {
      return JSON.parse(busParam);
    } catch {
      return tripId ? { id: tripId } : null;
    }
  });

  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);

  // The seat map is fetched fresh rather than read off the navigation param —
  // someone on the UniGo site may have taken a seat since the search ran.
  const loadSeats = useCallback(async () => {
    if (!bus?.id) {
      setError("This trip could not be loaded. Please go back and pick it again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await getSeats(bus.id);
      setBus(data.trip);
      setSeats(data.seats);
      // Drop any selection that was taken while the user was deciding.
      setSelectedSeats((prev) =>
        prev.filter((s) => data.seats.some((live) => live.id === s.id && live.status !== "booked"))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // `bus.id` is stable for this screen; refetching on the whole object would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bus?.id]);

  useEffect(() => {
    loadSeats();
  }, [loadSeats]);

  const toggleSeat = useCallback((seat) => {
    setSelectedSeats((prev) => {
      const already = prev.find((s) => s.id === seat.id);
      if (already) return prev.filter((s) => s.id !== seat.id);
      if (prev.length >= MAX_SEATS) return prev;
      return [...prev, seat];
    });
  }, []);

  const isSelected = (seat) => selectedSeats.some((s) => s.id === seat.id);

  const totalPrice = selectedSeats.length * (Number(bus?.price) || 0);

  const handleContinue = () => {
    router.push({
      pathname: "/(categories)/(transport)/unigo/PassengerDetails",
      params: {
        bus: JSON.stringify(bus),
        selectedSeats: JSON.stringify(selectedSeats),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {bus && <BusHeader bus={bus} />}
      <SeatLegend />

{loading ? (
  <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
    <SeatSelectionSkeleton />
  </ScrollView>
) : error ? (
  <View style={styles.centre}>
    <EmptyState
      icon="alert-circle-outline"
      title="Couldn't load seats"
      body={error}
      action={<Button title="Try again" variant="secondary" onPress={loadSeats} />}
    />
  </View>
) : (
  <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
    <BusLayout seats={seats} isSelected={isSelected} onPress={toggleSeat} />
    {selectedSeats.length >= MAX_SEATS && (
      <Text style={styles.limitNote}>
        You can book up to {MAX_SEATS} seats in one payment.
      </Text>
    )}
  </ScrollView>
)}

      {!loading && !error && (
        <BookingFooter
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
          onContinue={handleContinue}
        />
      )}
    </SafeAreaView>
  );
};

export default SeatSelection;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  body: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  centre: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  centreText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 15,
    color: colors.danger,
    textAlign: "center",
    fontWeight: "600",
  },
  retry: {
    backgroundColor: colors.brand,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  retryText: {
    color: colors.textInverse,
    fontWeight: "700",
  },
  limitNote: {
    marginTop: 16,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
