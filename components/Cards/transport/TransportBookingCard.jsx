// TransportBookingCard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/Colors";
import { useResumePayment } from "../../../hooks/transport/useResumePayment";
import { ticketQrUrl } from "../../../utils/api/transportUnigo";

/**
 * A UniGo bus trip in My Bookings — "Ticket Peek".
 *
 * A paid trip shows the boarding essentials inline, below a perforated edge, so
 * it reads as a stored travel credential rather than a row in a list. UniGo's
 * confirmation emails have never delivered, so this card is the passenger's
 * actual proof of travel — putting the QR one glance away, not one navigation
 * away, is the point.
 *
 * An UNPAID trip deliberately shows almost none of that. No QR, no booking
 * reference, no passenger name: those imply a seat that is confirmed, and it
 * isn't — the seat is only held for a few minutes and will lapse. That state
 * gets the countdown and a way to finish paying instead.
 *
 * The QR itself is rendered by the backend (see modules/transportUnigo) and
 * pulled in as a plain <Image> — `react-native-qrcode-svg` isn't in the
 * current production build, same reason it was dropped from Ticket.js.
 */

const STATUS_META = {
  success: { label: "Confirmed", color: COLORS.success, icon: "checkmark-circle" },
  pending: { label: "Awaiting payment", color: COLORS.warning, icon: "time-outline" },
  partial: { label: "Partly paid", color: COLORS.warning, icon: "alert-circle-outline" },
  failed: { label: "Payment failed", color: COLORS.error, icon: "close-circle-outline" },
  expired: { label: "Expired", color: COLORS.textFaint, icon: "close-circle-outline" },
};

const MONO = Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" });

/** mm:ss remaining, or null once the hold has lapsed. */
function useCountdown(expiresAt) {
  const target = useMemo(() => (expiresAt ? new Date(expiresAt).getTime() : null), [expiresAt]);
  const [remaining, setRemaining] = useState(() =>
    target ? Math.max(0, target - Date.now()) : null
  );

  useEffect(() => {
    if (!target) return undefined;
    setRemaining(Math.max(0, target - Date.now()));
    const timer = setInterval(() => {
      const left = Math.max(0, target - Date.now());
      setRemaining(left);
      if (left === 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [target]);

  if (remaining == null || remaining <= 0) return null;
  const totalSeconds = Math.ceil(remaining / 1000);
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
}

const PeekRow = ({ icon, label }) => (
  <View style={styles.peekRow}>
    <Ionicons name={icon} size={15} color={COLORS.textMuted} />
    <Text style={styles.peekText} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const TransportBookingCard = ({ booking, onPress, onChanged }) => {
  const meta = STATUS_META[booking.status] || STATUS_META.pending;
  const isPaid = booking.status === "success";
  const seats = booking.seatNumbers?.join(", ");
  const resolvedGroupRef = booking.groupRef || booking.partnerRef || "";

  const [peekOpen, setPeekOpen] = useState(true);
  const { resume, busy } = useResumePayment();
  const timeLeft = useCountdown(isPaid ? null : booking.expiresAt);

  const handleResume = () => resume(booking.groupRef, { onDone: () => onChanged?.() });

  return (
    <View style={styles.card}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.top}
        onPress={onPress}
        activeOpacity={isPaid ? 0.9 : 1}
        disabled={!isPaid}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconWrap}>
              <Ionicons name="bus" size={16} color={COLORS.button} />
            </View>
            <View>
              <Text style={styles.title}>Bus trip</Text>
              <Text style={styles.subtitle}>via UniGo Transport</Text>
            </View>
          </View>

          <View style={[styles.statusPill, { backgroundColor: `${meta.color}18` }]}>
            <Ionicons name={meta.icon} size={12} color={meta.color} />
            <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
          </View>
        </View>

        <View style={styles.routeRow}>
          <Text style={styles.city} numberOfLines={1}>
            {booking.from}
          </Text>
          <Ionicons name="arrow-forward" size={15} color={COLORS.textFaint} />
          <Text style={[styles.city, styles.cityRight]} numberOfLines={1}>
            {booking.to}
          </Text>
        </View>

        <View style={styles.metaRow}>
          {booking.departureTime ? (
            <View style={styles.metaChip}>
              <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
              <Text style={styles.metaText}>{booking.departureTime}</Text>
            </View>
          ) : null}

          {/* Seat is only shown once it is actually secured. */}
          {isPaid && seats ? (
            <View style={styles.metaChip}>
              <Ionicons name="person-outline" size={12} color={COLORS.textMuted} />
              <Text style={styles.metaText}>
                {booking.seatCount > 1 ? `Seats ${seats}` : `Seat ${seats}`}
              </Text>
            </View>
          ) : null}

          <View style={styles.metaChip}>
            <Ionicons name="pricetag-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.metaText}>GH₵{Number(booking.total || 0).toFixed(2)}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {isPaid ? (
        <>
          {/* ── Ticket peek ──────────────────────────────────────────── */}
          <View style={styles.perforation}>
            <View style={styles.notchLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.notchRight} />
          </View>

          {peekOpen && (
            <View style={styles.peek}>
              <View style={styles.qrBox}>
                <Image
                  source={{ uri: ticketQrUrl(resolvedGroupRef) }}
                  style={{ width: 112, height: 112 }}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.peekDetails}>
                <PeekRow
                  icon="person-outline"
                  label={booking.seatCount > 1 ? `Seats ${seats}` : `Seat ${seats}`}
                />
                <PeekRow icon="person-outline" label={`Passenger: ${booking.passenger?.name || "—"}`} />
                <PeekRow icon="clipboard-outline" label={`Booking Ref: ${booking.partnerRef || "—"}`} />
              </View>
            </View>
          )}

          <TouchableOpacity
            onPress={() => setPeekOpen((v) => !v)}
            activeOpacity={0.7}
            style={styles.peekToggleWrap}
          >
            <Text style={styles.peekToggle}>{peekOpen ? "Hide ticket" : "Show ticket"}</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.footer} onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.reference}>{booking.partnerRef}</Text>
            <View style={styles.cta}>
              <Text style={styles.ctaText}>View ticket</Text>
              <Ionicons name="chevron-forward" size={15} color={COLORS.button} />
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* ── Unpaid: no ticket details, just the clock and a way to pay ── */}
          <View style={styles.divider} />

          <View style={styles.holdNotice}>
            <Ionicons
              name={timeLeft ? "time-outline" : "alert-circle-outline"}
              size={15}
              color={timeLeft ? COLORS.warning : COLORS.error}
            />
            <Text style={styles.holdText}>
              {timeLeft
                ? `Your seat is held for ${timeLeft} more. Pay before it runs out or it goes back on sale.`
                : `Seats are only held for ${booking.holdMinutes || 5} minutes. Pay now to try to get yours back.`}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.payButton, busy && styles.payButtonBusy]}
            onPress={handleResume}
            disabled={busy}
            activeOpacity={0.85}
          >
            {busy ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="lock-closed" size={15} color="#fff" />
                <Text style={styles.payButtonText}>
                  Complete payment · GH₵{Number(booking.total || 0).toFixed(2)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default TransportBookingCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  top: { padding: 16, gap: 12 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: `${COLORS.button}12`,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 15, fontWeight: "700", color: COLORS.textDark },
  subtitle: { fontSize: 12, color: COLORS.textFaint, marginTop: 1 },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statusText: { fontSize: 12, fontWeight: "700" },

  routeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  city: { flex: 1, fontSize: 17, fontWeight: "800", color: COLORS.textDark, letterSpacing: -0.2 },
  cityRight: { textAlign: "right" },

  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F5F6F8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },
  metaText: { fontSize: 12, color: COLORS.textMuted, fontWeight: "500" },

  // Perforation — the cue that the lower half is a detachable ticket stub.
  perforation: { flexDirection: "row", alignItems: "center", height: 18 },
  dashedLine: {
    flex: 1,
    height: 1,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D8DCE3",
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

  peek: { flexDirection: "row", alignItems: "center", gap: 18, paddingHorizontal: 16, paddingTop: 14 },
  qrBox: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  peekDetails: { flex: 1, gap: 12 },
  peekRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  peekText: { flex: 1, fontSize: 13, color: COLORS.textDark, fontFamily: MONO },

  peekToggleWrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  peekToggle: { fontSize: 13, fontWeight: "700", color: COLORS.button },

  divider: { height: 1, backgroundColor: "#F1F2F4", marginHorizontal: 16, marginTop: 12 },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  reference: { fontSize: 13, color: COLORS.textFaint, fontFamily: MONO },
  cta: { flexDirection: "row", alignItems: "center", gap: 2 },
  ctaText: { fontSize: 15, fontWeight: "800", color: COLORS.button },

  holdNotice: {
    flexDirection: "row",
    gap: 9,
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  holdText: { flex: 1, fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },

  payButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.button,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 14,
  },
  payButtonBusy: { opacity: 0.7 },
  payButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});