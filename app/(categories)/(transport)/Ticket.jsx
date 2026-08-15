import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import COLORS from "../../../constants/Colors";
import FunctionalButton from "../../../components/ButtonComponents/FunctionalButton";
import { getBooking, ticketPdfUrl, ticketPdfHeaders } from "../../../utils/api/unigo";

/**
 * The ticket, assembled natively in HostelHubb from UniGo's booking data.
 *
 * The QR encodes the UniGo group reference — the same value printed on the
 * official PDF — so a HostelHubb screen and a UniGo ticket scan identically at
 * the terminal.
 */

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue} numberOfLines={2}>
      {value || "—"}
    </Text>
  </View>
);

const Ticket = () => {
  const { groupRef } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getBooking(groupRef, { fresh: true });
      setBooking(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [groupRef]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const target = `${FileSystem.cacheDirectory}unigo-ticket-${booking.partnerRef || groupRef}.pdf`;

      const result = await FileSystem.downloadAsync(ticketPdfUrl(groupRef), target, {
        headers: ticketPdfHeaders(),
      });

      if (result.status !== 200) {
        throw new Error("The ticket could not be downloaded. Please try again.");
      }

      if (await Sharing.isAvailableAsync()) {
        // The share sheet is also how the user saves to Files / Downloads.
        await Sharing.shareAsync(result.uri, {
          mimeType: "application/pdf",
          dialogTitle: "Your UniGo ticket",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("Ticket saved", "Your ticket PDF has been saved to the app's files.");
      }
    } catch (err) {
      Alert.alert("Download failed", err.message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" color={COLORS.button} />
        <Text style={styles.centreText}>Loading your ticket…</Text>
      </View>
    );
  }

  if (error || !booking) {
    return (
      <View style={styles.centre}>
        <Ionicons name="alert-circle-outline" size={40} color={COLORS.error} />
        <Text style={styles.errorText}>{error || "Ticket not found."}</Text>
        <TouchableOpacity style={styles.retry} onPress={load} activeOpacity={0.85}>
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isPaid = booking.status === "success";
  const seatLabel = booking.seatNumbers?.join(", ") || "—";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {!isPaid && (
          <View style={styles.pendingCard}>
            <Ionicons name="time-outline" size={18} color={COLORS.warning} />
            <Text style={styles.pendingText}>
              This booking is not confirmed yet. If you have paid, it will confirm shortly.
            </Text>
          </View>
        )}

        <View style={styles.ticket}>
          {/* Header */}
          <View style={styles.ticketHeader}>
            <Text style={styles.brand}>HostelHubb</Text>
            <Text style={styles.brandDivider}>·</Text>
            <Text style={styles.brandMuted}>powered by UniGo</Text>
          </View>

          {/* Route */}
          <View style={styles.routeRow}>
            <View style={styles.routeEnd}>
              <Text style={styles.routeCity} numberOfLines={2}>
                {booking.from}
              </Text>
            </View>
            <View style={styles.routeMiddle}>
              <View style={styles.routeDash} />
              <Ionicons name="bus" size={16} color={COLORS.button} />
              <View style={styles.routeDash} />
            </View>
            <View style={[styles.routeEnd, { alignItems: "flex-end" }]}>
              <Text style={[styles.routeCity, { textAlign: "right" }]} numberOfLines={2}>
                {booking.to}
              </Text>
            </View>
          </View>

          <View style={styles.perforation}>
            <View style={styles.notchLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.notchRight} />
          </View>

          {/* Details */}
          <View style={styles.details}>
            <Row label="Passenger" value={booking.passenger?.name} />
            <Row label="Departure" value={booking.departureTime} />
            <Row label={booking.seatCount > 1 ? "Seats" : "Seat"} value={seatLabel} />
            <Row label="Amount paid" value={`GH₵${Number(booking.total || 0).toFixed(2)}`} />
            <Row label="Reference" value={booking.partnerRef} />
          </View>

          {/* QR */}
          <View style={styles.qrWrap}>
            <View style={styles.qrBox}>
              <QRCode value={String(booking.groupRef || groupRef)} size={150} />
            </View>
            <Text style={styles.qrHint}>Show this code when boarding</Text>
          </View>
        </View>

        <Text style={styles.footNote}>
          Operated by UniGo Transport. Please arrive at your pickup point at least 30
          minutes before departure.
        </Text>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom || (Platform.OS === "android" ? 16 : 12) },
        ]}
      >
        <FunctionalButton
          text="Download official PDF"
          onPress={handleDownload}
          icon="download-outline"
          loading={downloading}
          disabled={!isPaid || downloading}
        />
        <TouchableOpacity onPress={() => router.replace("/(tabs)/(bookings)")} activeOpacity={0.7}>
          <Text style={styles.doneLink}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Ticket;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  scroll: { padding: 16, gap: 14, paddingBottom: 24 },
  centre: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
    backgroundColor: COLORS.surface,
  },
  centreText: { fontSize: 14, color: COLORS.textMuted },
  errorText: { fontSize: 15, color: COLORS.error, textAlign: "center", fontWeight: "600" },
  retry: {
    backgroundColor: COLORS.button,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  retryText: { color: "#fff", fontWeight: "700" },

  pendingCard: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 14,
    padding: 14,
  },
  pendingText: { flex: 1, fontSize: 12, color: "#92400E", lineHeight: 18 },

  ticket: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  ticketHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    backgroundColor: COLORS.button,
  },
  brand: { color: "#fff", fontWeight: "800", fontSize: 15, letterSpacing: 0.3 },
  brandDivider: { color: "rgba(255,255,255,0.6)", fontSize: 15 },
  brandMuted: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "500" },

  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 22,
    gap: 10,
  },
  routeEnd: { flex: 1 },
  routeCity: { fontSize: 17, fontWeight: "800", color: COLORS.textDark },
  routeMiddle: { flexDirection: "row", alignItems: "center", gap: 6, width: 80 },
  routeDash: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },

  perforation: { flexDirection: "row", alignItems: "center" },
  dashedLine: {
    flex: 1,
    height: 1,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
  },
  notchLeft: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.surface,
    marginLeft: -9,
  },
  notchRight: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.surface,
    marginRight: -9,
  },

  details: { paddingHorizontal: 20, paddingVertical: 18, gap: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowLabel: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  rowValue: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: "700",
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },

  qrWrap: { alignItems: "center", paddingBottom: 24, gap: 10 },
  qrBox: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  qrHint: { fontSize: 11, color: COLORS.textFaint },

  footNote: {
    fontSize: 11,
    color: COLORS.textFaint,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 12,
  },

  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 12,
  },
  doneLink: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: "600",
    paddingBottom: 4,
  },
});
