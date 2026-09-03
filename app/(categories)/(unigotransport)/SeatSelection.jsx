import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import COLORS from "../../../constants/Colors";
import BusHeader from "../../../components/Headers/BusHeader";
import SeatLegend from "../../../components/Transport/Seatlegend";
import BusLayout from "../../../components/Transport/BusLayout";
import SeatSelectionSkeleton from "../../../components/Transport/SeatSelectionSkeleton";
import BookingFooter from "../../../components/Transport/BookingFooter";
import { getSeats } from "../../../utils/api/transportUnigo";

/** Booking more than this in one payment gets unwieldy, and UniGo caps it too. */
const MAX_SEATS = 10;

const SeatSelection = () => {
  const { bus: busParam } = useLocalSearchParams();
  const router = useRouter();

  const [bus, setBus] = useState(() => {
    try {
      return JSON.parse(busParam);
    } catch {
      return null;
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
      pathname: "/(categories)/(unigotransport)/PassengerDetails",
      params: {
        bus: JSON.stringify(bus),
        selectedSeats: JSON.stringify(selectedSeats),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {bus && <BusHeader bus={bus} />}
      <SeatLegend />

{loading ? (
  <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
    <SeatSelectionSkeleton />
  </ScrollView>
) : error ? (
  <View style={styles.centre}>
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity style={styles.retry} onPress={loadSeats} activeOpacity={0.85}>
      <Text style={styles.retryText}>Try again</Text>
    </TouchableOpacity>
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
    backgroundColor: "#fff",
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
    color: COLORS.textMuted,
  },
  errorText: {
    fontSize: 15,
    color: COLORS.error,
    textAlign: "center",
    fontWeight: "600",
  },
  retry: {
    backgroundColor: COLORS.button,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
  },
  limitNote: {
    marginTop: 16,
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
  },
});
