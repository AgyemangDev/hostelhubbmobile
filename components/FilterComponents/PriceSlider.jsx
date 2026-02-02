import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import { AccommodationContext } from "../../context/AccommodationContext";
import COLORS from "../../constants/Colors";

const PriceSlider = () => {
  const { filters, setFilters } = useContext(AccommodationContext);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Price Range</Text>

      <Slider
        value={filters.priceRange}
        onValueChange={(v) => setFilters({ priceRange: v })}
        minimumValue={2000}
        maximumValue={30000}
        step={500}

        /* 🎨 COLORS */
        minimumTrackTintColor={COLORS.background} // active range
        maximumTrackTintColor="#E5E7EB"            // inactive range
        thumbTintColor={COLORS.background}         // handles

        /* 🎚 STYLES */
        trackStyle={styles.track}
        thumbStyle={styles.thumb}
      />

      <Text style={styles.value}>
        GHC {filters.priceRange[0]} — {filters.priceRange[1]}
      </Text>
    </View>
  );
};

export default PriceSlider;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  label: {
    fontWeight: "600",
    marginBottom: 2,
  },
  value: {
    marginTop: 2,
    fontWeight: "500",
  },
  track: {
    height: 5,
    borderRadius: 3,
  },
  thumb: {
    height: 18,
    width: 18,
    borderRadius: 9,
  },
});