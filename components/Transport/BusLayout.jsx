import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Seat from "./SeatComponent";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AisleGap = () => <View style={styles.aisleGap} />;

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
    <>
      {/* Bus nose */}
      <View style={styles.busFront}>
        <Ionicons name="ellipse-outline" size={20} color="#94A3B8" style={{ opacity: 0.6 }} />
        <Text style={styles.frontLabel}>DRIVER</Text>
      </View>

      {/* Column labels */}
      <View style={styles.columnLabelRow}>
        <View style={styles.rowNumSpacer} />
        <Text style={[styles.colLabel, { width: 42 }]}>A</Text>
        <Text style={[styles.colLabel, { width: 42 }]}>B</Text>
        <AisleGap />
        <Text style={[styles.colLabel, { width: 42 }]}>C</Text>
      </View>

      {/* Main rows */}
      {rows.map((row, rIdx) => (
        <View key={rIdx} style={styles.row}>
          <Text style={styles.rowNum}>{rIdx + 1}</Text>
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
          <AisleGap />
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
    </>
  );
};

export default BusLayout;

const styles = StyleSheet.create({
  busFront: {
    width: "80%",
    height: 48,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    backgroundColor: "#E2E8F4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 4,
  },
  frontLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 2.5,
  },
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
  colLabel: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  rowNum: {
    width: 22,
    fontSize: 10,
    color: "#CBD5E1",
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 12,
    width: "90%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1.5,
  },
  backRow: {
    flexDirection: "row",
    gap: 8,
  },
});