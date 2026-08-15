import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, ScrollView, StyleSheet, Platform, Alert, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import COLORS from "../../../constants/Colors";
import { UserContext } from "../../../context/UserContext";
import TripInfoCard from "../../../components/Cards/transport/TripInfoCard";
import PassengerInfoCard from "../../../components/Cards/transport/PassengerInfoCard";
import PriceBreakdownCard from "../../../components/Cards/transport/PriceBreakdownCard";
import FunctionalButton from "../../../components/ButtonComponents/FunctionalButton";
import {
  createBooking,
  startPayment,
  getBooking,
  TRANSPORT_RETURN_SCHEME,
} from "../../../utils/api/unigo";

/**
 * Pay for a UniGo trip.
 *
 * The money never touches the HostelHubb wallet: UniGo creates the booking,
 * stamps it as ours, and hands back a Hubtel checkout URL. We open that in an
 * in-app browser; Hubtel returns to a UniGo bridge page which redirects to
 * `hostelhubb://transport/booking/<groupRef>`, closing the sheet.
 *
 * The sheet closing is NOT proof of payment — the user may have cancelled or
 * backed out — so we always confirm with UniGo before showing a ticket.
 */

/** Hubtel's webhook can trail the user's return; poll briefly before giving up. */
const CONFIRM_ATTEMPTS = 6;
const CONFIRM_DELAY_MS = 2000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const PaymentScreen = () => {
  const {
    bus: busParam,
    selectedSeats: seatsParam,
    passenger: passengerParam,
  } = useLocalSearchParams();

  const { user, userInfo } = useContext(UserContext);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [preparing, setPreparing] = useState(true);
  const [paying, setPaying] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);

  // Guards against creating a second pending booking if the effect re-runs.
  const bookingRequested = useRef(false);
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);

  const bus = useMemo(() => {
    try { return JSON.parse(busParam); } catch { return null; }
  }, [busParam]);

  const selectedSeats = useMemo(() => {
    try { return JSON.parse(seatsParam) || []; } catch { return []; }
  }, [seatsParam]);

  const passenger = useMemo(() => {
    try { return JSON.parse(passengerParam) || {}; } catch { return {}; }
  }, [passengerParam]);

  // ── Reserve the booking up front so the price shown is UniGo's, not ours ──
  const prepare = useCallback(async () => {
    if (bookingRequested.current) return;
    bookingRequested.current = true;

    setPreparing(true);
    setError("");

    try {
      const data = await createBooking({
        busId: bus?.id,
        seatIds: selectedSeats.map((s) => s.id),
        passenger,
        partnerUserId: user?.uid,
      });
      if (mounted.current) setBooking(data);
    } catch (err) {
      if (mounted.current) setError(err.message);
      // Allow a retry to create a fresh booking.
      bookingRequested.current = false;
    } finally {
      if (mounted.current) setPreparing(false);
    }
  }, [bus?.id, selectedSeats, passenger, user?.uid]);

  useEffect(() => {
    prepare();
  }, [prepare]);

  // ── Confirm with UniGo after the checkout sheet closes ────────────────────
  const confirmPayment = useCallback(async (groupRef) => {
    setConfirming(true);
    try {
      for (let attempt = 0; attempt < CONFIRM_ATTEMPTS; attempt += 1) {
        const status = await getBooking(groupRef, { fresh: true });

        if (status.status === "success") {
          router.replace({
            pathname: "/(categories)/(transport)/Ticket",
            // `justPaid` makes the ticket screen save the PDF straight away —
            // UniGo's confirmation emails do not deliver, so the passenger must
            // walk away holding the ticket, not expecting one to arrive.
            params: { groupRef, justPaid: "1" },
          });
          return;
        }
        if (status.status === "failed") {
          setError("That payment did not go through. You can try again.");
          return;
        }
        if (attempt < CONFIRM_ATTEMPTS - 1) await sleep(CONFIRM_DELAY_MS);
      }

      // Still pending: the money may yet land, so never imply failure.
      Alert.alert(
        "Still confirming",
        "We haven't had confirmation from the payment provider yet. If you completed payment, your ticket will appear in My Trips shortly — you have not been charged twice.",
        [
          { text: "Check again", onPress: () => confirmPayment(groupRef) },
          { text: "Done", style: "cancel", onPress: () => router.replace("/(tabs)/(bookings)") },
        ]
      );
    } catch (err) {
      setError(err.message);
    } finally {
      if (mounted.current) setConfirming(false);
    }
  }, [router]);

  // ── Pay ───────────────────────────────────────────────────────────────────
  const handlePayment = async () => {
    if (!booking?.groupRef) return;

    setPaying(true);
    setError("");

    try {
      const payment = await startPayment(booking.groupRef);
      const checkoutUrl = payment.checkoutDirectUrl || payment.checkoutUrl;
      if (!checkoutUrl) throw new Error("The payment provider did not return a checkout page.");

      // openAuthSessionAsync keeps the sheet inside the app and resolves as soon
      // as a URL with our scheme is hit — or when the user dismisses it.
      await WebBrowser.openAuthSessionAsync(checkoutUrl, TRANSPORT_RETURN_SCHEME);

      // Whatever the sheet reported, UniGo is the source of truth.
      await confirmPayment(booking.groupRef);
    } catch (err) {
      setError(err.message);
    } finally {
      if (mounted.current) setPaying(false);
    }
  };

  const priceLines = useMemo(() => {
    const pricing = booking?.pricing;
    if (!pricing) return [];
    return [
      {
        label: `Seat${pricing.seatCount > 1 ? "s" : ""} × ${pricing.seatCount}`,
        amount: pricing.subtotal,
      },
      { label: "Payment processing fee", amount: pricing.fee, muted: true },
    ];
  }, [booking]);

  const busy = preparing || paying || confirming;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {error ? (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={20} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {bus && <TripInfoCard bus={bus} selectedSeats={selectedSeats} />}

        <PassengerInfoCard passenger={passenger} userInfo={userInfo} user={user} />

        {preparing ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={COLORS.button} />
            <Text style={styles.loadingText}>Reserving your seat with UniGo…</Text>
          </View>
        ) : booking ? (
          <>
            <PriceBreakdownCard lines={priceLines} total={booking.pricing.total} />

            <View style={styles.noticeCard}>
              <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.textMuted} />
              <Text style={styles.noticeText}>
                You'll pay UniGo Transport securely by Mobile Money or card. Your seat is
                only confirmed once payment succeeds — nothing is held until then.
              </Text>
            </View>

            <Text style={styles.reference}>Booking reference {booking.partnerRef}</Text>
          </>
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom || (Platform.OS === "android" ? 16 : 12) },
        ]}
      >
        {confirming && (
          <Text style={styles.confirmingText}>Confirming your payment with UniGo…</Text>
        )}
        <FunctionalButton
          text={
            booking
              ? `Pay GH₵${Number(booking.pricing.total).toFixed(2)}`
              : "Pay"
          }
          onPress={error && !booking ? prepare : handlePayment}
          icon={error && !booking ? "refresh" : "lock-closed"}
          loading={busy}
          disabled={busy || (!booking && !error)}
        />
      </View>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  scroll: { padding: 16, gap: 14, paddingBottom: 24 },
  loadingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    alignItems: "center",
    gap: 12,
  },
  loadingText: { fontSize: 13, color: COLORS.textMuted },
  errorCard: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: "#FEF2F2",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: { flex: 1, fontSize: 13, color: COLORS.error, lineHeight: 18, fontWeight: "500" },
  noticeCard: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 14,
  },
  noticeText: { flex: 1, fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },
  reference: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textFaint,
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 8,
  },
  confirmingText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
