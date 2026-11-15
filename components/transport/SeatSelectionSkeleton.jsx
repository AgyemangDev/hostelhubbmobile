import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ScrollView } from "react-native";
import BookingFooter from "./BookingFooter";

// Mirrors BusLayout's bus-shell dimensions so nothing jumps/resizes once
// real seats arrive. 16 main rows + 4-seat back row, same numbering
// convention as BusLayout (1-48 main, 49-52 back).
const ROWS = 16;
const BACK_SEATS = 4;

const AisleGap = () => <View style={styles.aisleGap} />;

const SeatSelectionSkeleton = () => {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.busBody}>
          <View style={styles.busFront}>
            <View style={styles.headlight} pointerEvents="none" />
            <View style={[styles.headlight, styles.headlightRight]} pointerEvents="none" />
          </View>

          {Array.from({ length: ROWS }).map((_, rIdx) => (
            <View key={rIdx} style={styles.row}>
              <View style={styles.rowNumSpacer} />
              <View style={styles.window} />
              <Animated.View style={[styles.box, { opacity: pulse }]} />
              <Animated.View style={[styles.box, { opacity: pulse }]} />
              <AisleGap />
              <Animated.View style={[styles.box, { opacity: pulse }]} />
              <View style={styles.window} />
            </View>
          ))}

          <View style={styles.dividerRow} />

          <View style={styles.backRow}>
            {Array.from({ length: BACK_SEATS }).map((_, i) => (
              <Animated.View key={i} style={[styles.box, { opacity: pulse }]} />
            ))}
          </View>

          <View style={styles.tailLightRow}>
            <View style={styles.tailLight} />
            <View style={styles.tailLight} />
          </View>

          <View style={[styles.wheel, styles.wheelLeft]} pointerEvents="none" />
          <View style={[styles.wheel, styles.wheelRight]} pointerEvents="none" />
        </View>
      </ScrollView>
    </>
  );
};

export default SeatSelectionSkeleton;

const styles = StyleSheet.create({
  body: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // ── Bus shell (matches BusLayout) ──
  busBody: {
    position: "relative",
    width: "100%",
    backgroundColor: "#FBFCFE",
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: "#E2E8F4",
    paddingTop: 14,
    paddingHorizontal: 12,
    paddingBottom: 24,
    marginBottom: 24,
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 4,
  },
  busFront: {
    width: "82%",
    height: 48,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    backgroundColor: "#EEF1F6",
    alignSelf: "center",
    marginBottom: 20,
  },
  headlight: {
    position: "absolute",
    bottom: -3,
    left: 10,
    width: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F1F5F9",
  },
  headlightRight: {
    left: undefined,
    right: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  rowNumSpacer: {
    width: 22,
    marginRight: 2,
  },
  window: {
    width: 10,
    height: 34,
    borderRadius: 5,
    backgroundColor: "#EEF1F6",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  box: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
  },
  aisleGap: {
    width: 22,
  },
  dividerRow: {
    height: 1,
    backgroundColor: "#E2E8F0",
    width: "90%",
    alignSelf: "center",
    marginVertical: 16,
  },
  backRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },

  tailLightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 26,
    marginTop: 16,
  },
  tailLight: {
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F1F5F9",
  },

  wheel: {
    position: "absolute",
    bottom: -14,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#CBD5E1",
    borderWidth: 4,
    borderColor: "#E2E8F0",
  },
  wheelLeft: {
    left: 36,
  },
  wheelRight: {
    right: 36,
  },
});