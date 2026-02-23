import React, { useState, useCallback } from "react";
import { StyleSheet, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import COLORS from "../../../constants/Colors";
import BusHeader from "../../../components/Headers/BusHeader";
import SeatLegend from "../../../components/Transport/Seatlegend";
import BusLayout from "../../../components/Transport/BusLayout";
import BookingFooter from "../../../components/Transport/BookingFooter";

const SeatSelection = () => {
  const { bus: busParam } = useLocalSearchParams();
  const bus = JSON.parse(busParam);
  const router = useRouter();

  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = useCallback((seat) => {
    setSelectedSeats((prev) =>
      prev.find((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  }, []);

  const isSelected = (seat) => selectedSeats.some((s) => s.id === seat.id);

  const handleContinue = () => {
    router.push({
      pathname: "/(categories)/(transport)/StorageCompartment",
      params: {
        bus: busParam,
        selectedSeats: JSON.stringify(selectedSeats),
        totalPrice: selectedSeats.length * bus.price,
      },
    });
  };

  return (
    // edges="top" so SafeAreaView only pads the status bar.
    // BookingFooter handles its own bottom inset via useSafeAreaInsets.
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <BusHeader bus={bus} />
      <SeatLegend />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <BusLayout
          seats={bus.seats}
          isSelected={isSelected}
          onPress={toggleSeat}
        />
      </ScrollView>

      <BookingFooter
        selectedSeats={selectedSeats}
        totalPrice={selectedSeats.length * bus.price}
        onContinue={handleContinue}
      />
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
});