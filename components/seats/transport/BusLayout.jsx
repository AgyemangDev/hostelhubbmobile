import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Seat from "./Seat";
import { colors } from "../../../constants/theme";

// ─── Helpers ──────────────────────────────────────────────────────────────────


const chunk = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
};

// ─── BusLayout ────────────────────────────────────────────────────────────────

/**
 * Seat numbering convention:
 *   - Seats 1–48   → main cabin (16 rows × 3 seats: A, B, aisle, C)
 *   - Seat  49–52  → back row (shown below divider)
 *   - Seat  53     → driver seat (never rendered)
 */
const BusLayout = ({ seats, isSelected, onPress }) => {
  // Drop seat 53 (driver) before splitting
  const visible = seats.filter((s) => s.number !== 53);

  const mainSeats = visible.slice(0, 48);   // seats 1-48
  const backSeats = visible.slice(48);       // seats 49-52

  const rows = chunk(mainSeats, 3);

  return (
    <View style={styles.busBody}>
      {/* Windshield / driver cap */}
      <View style={styles.busFront}>
        <View style={styles.headlight} pointerEvents="none" />
        <View style={[styles.headlight, styles.headlightRight]} pointerEvents="none" />
        <Ionicons name="ellipse-outline" size={20} color={colors.textSecondary} style={{ opacity: 0.6}} />
        <Text style={styles.frontLabel}>DRIVER</Text>
      </View>

      {/* Column labels */}
      <View style={styles.columnLabelRow}>
        <View style={styles.rowNumSpacer} />
        <View style={styles.windowSpacer} />
        <Text style={[styles.colLabel, { width: 42 }]}>A</Text>
        <Text style={[styles.colLabel, { width: 42 }]}>B</Text>
        <View style={styles.aisleGap} />
        <Text style={[styles.colLabel, { width: 42 }]}>C</Text>
        <View style={styles.windowSpacer} />
      </View>

      {/* Main rows */}
      {rows.map((row, rIdx) => (
        <View key={rIdx} style={styles.row}>
          <Text style={styles.rowNum}>{rIdx + 1}</Text>
          <View style={styles.window} />
          {[0, 1].map((col) =>
            row[col] ? (
              <Seat
                key={row[col].id}
                seat={row[col]}
                isSelected={isSelected(row[col])}
                isBooked={row[col].status === "booked"}
                onPress={onPress}
              />
            ) : (
              <View key={col} style={styles.placeholder} />
            )
          )}
          <View style={styles.aisleGap} />
          {row[2] ? (
            <Seat
              seat={row[2]}
              isSelected={isSelected(row[2])}
              isBooked={row[2].status === "booked"}
              onPress={onPress}
            />
          ) : (
            <View style={styles.placeholder} />
          )}
          <View style={styles.window} />
        </View>
      ))}

      {/* Back row */}
      {backSeats.length > 0 && (
        <>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>BACK ROW</Text>
            <View style={styles.dividerLine} />
          </View>
          <View style={styles.backRow}>
            {backSeats.map((seat) => (
              <Seat
                key={seat.id}
                seat={seat}
                isSelected={isSelected(seat)}
                isBooked={seat.status === "booked"}
                onPress={onPress}
              />
            ))}
          </View>
        </>
      )}

      {/* Rear bumper / tail lights */}
      <View style={styles.tailLightRow}>
        <View style={styles.tailLight} />
        <View style={styles.tailLight} />
      </View>

      {/* Wheels poking out of the shell */}
      <View style={[styles.wheel, styles.wheelLeft]} pointerEvents="none" />
      <View style={[styles.wheel, styles.wheelRight]} pointerEvents="none" />
    </View>
  );
};

export default BusLayout;

const styles = StyleSheet.create({
  // ── Bus shell ──
  busBody: {
    position: "relative",
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingTop: 14,
    paddingHorizontal: 12,
    paddingBottom: 24,
    marginBottom: 24,
    shadowColor: "#57534E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0,
    shadowRadius: 14,
    elevation: 0,
  },

  // ── Front cap ──
  busFront: {
    width: "82%",
    height: 48,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    backgroundColor: "#E7E5E4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  headlight: {
    position: "absolute",
    bottom: -3,
    left: 10,
    width: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: "transparent",
  },
  headlightRight: {
    left: undefined,
    right: 10,
  },
  frontLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 2.5,
  },

  // ── Column labels ──
  columnLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  rowNumSpacer: {
    width: 22,
    marginRight: 2,
  },
  windowSpacer: {
    width: 10,
  },
  colLabel: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 1,
  },

  // ── Rows ──
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  rowNum: {
    width: 22,
    fontSize: 10,
    color: "#D6D3D1",
    fontWeight: "600",
    textAlign: "right",
    marginRight: 2,
  },
  placeholder: {
    width: 42,
    height: 42,
  },
  aisleGap: {
    width: 22,
  },
  window: {
    width: 10,
    height: 34,
    borderRadius: 5,
    backgroundColor: colors.fill,
    borderWidth: 1,
    borderColor: "#F5F5F4",
  },

  // ── Divider / back row ──
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 12,
    width: "90%",
    alignSelf: "center",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E7E5E4",
  },
  dividerLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
  backRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },

  // ── Rear details ──
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
    backgroundColor: "transparent",
  },

  // ── Wheels ──
  wheel: {
    position: "absolute",
    bottom: -14,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.text,
    borderWidth: 4,
    borderColor: colors.borderStrong,
  },
  wheelLeft: {
    left: 36,
  },
  wheelRight: {
    right: 36,
  },
});