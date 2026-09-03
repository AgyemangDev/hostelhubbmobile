import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
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
import * as WebBrowser from "expo-web-browser";
import COLORS from "../../../constants/Colors";
import FunctionalButton from "../../../components/ButtonComponents/FunctionalButton";
import { getBooking } from "../../../utils/api/transportUnigo";
import { ticketQrUrl, ticketPdfDownloadUrl } from "../../../utils/api/transportUnigo";
import { useResumePayment } from "../../../hooks/transport/useResumePayment";

/**
 * Same ticket screen as `(transport)/Ticket.js`, minus the two native
 * modules that aren't in the current production build:
 *
 *  - `react-native-qrcode-svg` -> replaced with an <Image> pulling a PNG
 *    rendered by the backend at /api/transport-unigo/ticket/:groupRef/qr.
 *    Still encodes the same UniGo groupRef, so it scans identically.
 *
 *  - `expo-file-system` + `expo-sharing` -> replaced with
 *    `expo-web-browser` (already used elsewhere, e.g. PaymentScreen),
 *    opening the backend's PDF-proxy URL. The device's own browser sheet
 *    provides the save/share affordance instead of a native share sheet.
 *
 * If this whole approach needs to be rolled back, `(transport)/Ticket.js`
 * is left untouched and still works exactly as before.
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
  const { groupRef, justPaid } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);
  const autoSaved = useRef(false);
  const { resume, busy: resuming } = useResumePayment();

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

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      // No local file, no share sheet — just hand the browser a URL. The
      // browser's own UI (share / print / save to Files) covers what
      // `expo-sharing` used to.
      await WebBrowser.openBrowserAsync(ticketPdfDownloadUrl(groupRef));
      setSaved(true);
    } catch (err) {
      Alert.alert("Download failed", err.message);
    } finally {
      setDownloading(false);
    }
  }, [groupRef]);

  // Straight from payment: open the PDF once automatically. Later visits
  // from the Bookings tab just show the button.
  useEffect(() => {
    if (justPaid !== "1" || autoSaved.current) return;
    if (booking?.status !== "success") return;
    autoSaved.current = true;
    handleDownload();
  }, [justPaid, booking, handleDownload]);

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
  const resolvedGroupRef = booking.groupRef || groupRef;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {!isPaid && (
          <View style={styles.pendingCard}>
            <Ionicons name="time-outline" size={18} color={COLORS.warning} />
            <View style={{ flex: 1, gap: 10 }}>
              <Text style={styles.pendingText}>
                This booking is not paid for yet, so there is no ticket to show. Seats are
                only held for {booking.holdMinutes || 5} minutes.
              </Text>
              <TouchableOpacity
                style={styles.payNow}
                onPress={() => resume(groupRef, { onDone: load })}
                disabled={resuming}
                activeOpacity={0.85}
              >
                {resuming ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="lock-closed" size={14} color="#fff" />
                    <Text style={styles.payNowText}>
                      Complete payment · GH₵{Number(booking.total || 0).toFixed(2)}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
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

          <View style={styles.details}>
            <Row label="Departure" value={booking.departureTime} />
            {isPaid && <Row label="Passenger" value={booking.passenger?.name} />}
            {isPaid && (
              <Row label={booking.seatCount > 1 ? "Seats" : "Seat"} value={seatLabel} />
            )}
            <Row
              label={isPaid ? "Amount paid" : "Amount due"}
              value={`GH₵${Number(booking.total || 0).toFixed(2)}`}
            />
            {isPaid && <Row label="Reference" value={booking.partnerRef} />}
          </View>

          {/* QR — rendered by the backend, not on device */}
          {isPaid ? (
            <View style={styles.qrWrap}>
              <View style={styles.qrBox}>
                <Image
                  source={{ uri: ticketQrUrl(resolvedGroupRef) }}
                  style={{ width: 150, height: 150 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.qrHint}>Show this code when boarding</Text>
            </View>
          ) : (
            <View style={styles.qrWrap}>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="lock-closed-outline" size={26} color={COLORS.textFaint} />
              </View>
              <Text style={styles.qrHint}>Your boarding code appears once payment clears</Text>
            </View>
          )}
        </View>

        {isPaid && (
          <View style={saved ? styles.savedCard : styles.saveCard}>
            <Ionicons
              name={saved ? "checkmark-circle" : "download-outline"}
              size={18}
              color={saved ? COLORS.success : COLORS.button}
            />
            <Text style={styles.saveText}>
              {saved
                ? "Ticket opened. It also stays here in My Trips — you can come back to it any time."
                : "Save your ticket now. We don't send it by email, so keep a copy on your phone. It also stays here in My Trips."}
            </Text>
          </View>
        )}

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
  pendingText: { fontSize: 12, color: "#92400E", lineHeight: 18 },
  payNow: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7,
    backgroundColor: COLORS.button, paddingVertical: 11, borderRadius: 12,
  },
  payNowText: { color: "#fff", fontWeight: "700", fontSize: 13 },

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
  qrHint: { fontSize: 11, color: COLORS.textFaint, textAlign: "center", paddingHorizontal: 24 },
  qrPlaceholder: {
    width: 178,
    height: 178,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFB",
    alignItems: "center",
    justifyContent: "center",
  },

  saveCard: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: `${COLORS.button}10`,
    borderWidth: 1,
    borderColor: `${COLORS.button}30`,
    borderRadius: 14,
    padding: 14,
  },
  savedCard: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: `${COLORS.success}10`,
    borderWidth: 1,
    borderColor: `${COLORS.success}30`,
    borderRadius: 14,
    padding: 14,
  },
  saveText: { flex: 1, fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },
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