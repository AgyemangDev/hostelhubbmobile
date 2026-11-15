

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Button, Eyebrow, Notice, PriceBar, ScreenHeader, money } from "../../../../components/ui/ds";
import { colors, radius, space, type } from "../../../../constants/theme";
import { UserContext } from "../../../../context/UserContext";


import {
  createBooking,
  startPayment,
  getBooking,
  TRANSPORT_RETURN_SCHEME,
} from "../../../../utils/api/transportUnigo";
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
            pathname: "/(categories)/(transport)/unigo/Ticket",
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
  const route = bus?.route || {};

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader title="Pay to confirm" subtitle={route.from ? `${route.from} → ${route.to}` : undefined} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {error ? <Notice tone="danger" title="Something went wrong">{error}</Notice> : null}

        <View style={styles.trip}>
          <View style={styles.tripRow}>
            <View style={{ flex: 1, gap: 2 }}>
              <Eyebrow>TRIP</Eyebrow>
              <Text style={type.bodyStrong}>{route.from} → {route.to}</Text>
              <Text style={[type.caption, { color: colors.textSecondary }]}>
                {[bus?.pickupDate, bus?.departureTime, bus?.name].filter(Boolean).join(" · ")}
              </Text>
            </View>
          </View>
          <View style={styles.tripRow}>
            <View style={{ flex: 1, gap: 2 }}>
              <Eyebrow>PASSENGER</Eyebrow>
              <Text style={type.bodyStrong}>{passenger?.name}</Text>
              <Text style={[type.caption, { color: colors.textSecondary }]}>
                {[passenger?.phone, `Seat${selectedSeats.length > 1 ? "s" : ""} ${selectedSeats.map((x) => x.number).join(", ")}`].filter(Boolean).join(" · ")}
              </Text>
            </View>
            <Button title="Edit" variant="ghost" size="sm" onPress={() => router.back()} />
          </View>
        </View>

        {preparing ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.brand} />
            <Text style={[type.caption, { color: colors.textSecondary }]}>Holding your seat with UniGo…</Text>
          </View>
        ) : booking ? (
          <View style={{ gap: space.sm }}>
            {priceLines.map((l) => (
              <View key={l.label} style={styles.line}>
                <Text style={[type.body, l.muted && { color: colors.textSecondary }]}>{l.label}</Text>
                <Text style={[type.body, l.muted && { color: colors.textSecondary }]}>{money(l.amount)}</Text>
              </View>
            ))}
            <View style={[styles.line, styles.total]}>
              <Text style={[type.bodyStrong, { fontWeight: "800" }]}>Total</Text>
              <Text style={[type.bodyStrong, { fontWeight: "800" }]}>{money(booking.pricing.total)}</Text>
            </View>
            <View style={styles.secure}>
              <Ionicons name="lock-closed-outline" size={16} color={colors.textSecondary} />
              <Text style={[type.caption, { color: colors.textSecondary, flex: 1 }]}>
                Mobile money or card. Your seat is only confirmed once payment succeeds.
              </Text>
            </View>
            <Text style={[type.caption, { color: colors.textSecondary }]} selectable>Reference {booking.partnerRef}</Text>
          </View>
        ) : null}
      </ScrollView>

      <PriceBar>
        <View style={{ flex: 1, gap: space.xs }}>
          {confirming ? (
            <Text style={[type.caption, { color: colors.textSecondary, textAlign: "center" }]}>Confirming your payment with UniGo…</Text>
          ) : null}
          {!booking && error && !preparing ? (
            <Button title="Try again" variant="secondary" onPress={prepare} />
          ) : (
            <Button
              title={booking ? `Pay ${money(booking.pricing.total)}` : "Pay"}
              onPress={handlePayment}
              loading={busy}
              disabled={!booking}
            />
          )}
        </View>
      </PriceBar>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, paddingTop: space.xs, gap: space.xl, paddingBottom: space.xxl },
  trip: { borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: space.md },
  tripRow: { flexDirection: "row", alignItems: "center", paddingVertical: space.md, gap: space.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  loading: { alignItems: "center", gap: space.sm, paddingVertical: space.xl },
  line: { flexDirection: "row", justifyContent: "space-between", gap: space.md },
  total: { paddingTop: space.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderStrong },
  secure: { flexDirection: "row", gap: space.xs, alignItems: "flex-start", marginTop: space.xs },
});
