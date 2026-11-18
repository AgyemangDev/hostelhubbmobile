import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import BookingFooter from "../../bars/transport/BookingFooter";
import { Skeleton } from "../../ui";
import { colors } from "../../../constants/theme";

// Mirrors BusLayout's bus-shell dimensions so nothing jumps/resizes once
// real seats arrive. 16 main rows + 4-seat back row, same numbering
// convention as BusLayout (1-48 main, 49-52 back).
const ROWS = 16;
const BACK_SEATS = 4;

const SeatSelectionSkeleton = () => {
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
              <Skeleton style={styles.box} />
              <Skeleton style={styles.box} />
              <View style={styles.aisleGap} />
              <Skeleton style={styles.box} />
              <View style={styles.window} />
            </View>
          ))}

          <View style={styles.dividerRow} />

          <View style={styles.backRow}>
            {Array.from({ length: BACK_SEATS }).map((_, i) => (
              <Skeleton key={i} style={styles.box} />
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
    backgroundColor: colors.surfaceSunken,
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
    backgroundColor: colors.fill,
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
    backgroundColor: colors.fill,
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
    backgroundColor: colors.fill,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.fill,
  },

  wheel: {
    position: "absolute",
    bottom: -14,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#CBD5E1",
    borderWidth: 4,
    borderColor: colors.border,
  },
  wheelLeft: {
    left: 36,
  },
  wheelRight: {
    right: 36,
  },
});