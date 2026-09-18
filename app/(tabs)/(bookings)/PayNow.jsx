import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UserContext } from "../../../context/UserContext";
import { useBookingsContext } from "../../../context/BookingsContext";
import { initiatePayment } from "../../../services/paymentService";
import { usePaymentConfirmation } from "../../../hooks/usePaymentConfirmation";
import COLORS from "../../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import API_BASE_URL from "../../../utils/api/api";
import { PLATFORM_MARKUP_RATE } from "../../../constants/bookingConstants";

import {
  PropertyCard,
  BookingDetails,
  AmountSection,
  ReferralSection,
} from "../../../components/PayNowComponents/payNowComponent";

/* ─── Main screen ─────────────────────────────────────────────────────────── */
const PayNow = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, userInfo } = useContext(UserContext);
  const { confirm, busy } = usePaymentConfirmation();
  const { refetch: refetchBookings } = useBookingsContext();

  // Fetched by id rather than passed as a JSON-stringified route param —
  // that param round-trip was corrupting the accommodation image's Firebase
  // Storage URL (never an issue for hubclip's shorter/simpler URLs), which
  // is exactly why the image only failed to load for accommodation
  // bookings on this screen.
  const { bookingId: routeBookingId } = useLocalSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!routeBookingId || !user) return;

    let cancelled = false;

    (async () => {
      try {
        const token = await user.getIdToken(false);
        const res = await fetch(`${API_BASE_URL}/bookings/accommodation/fetch/${routeBookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Could not load booking");
        if (!cancelled) setBookingData(data.booking);
      } catch (err) {
        console.error("[PayNow] Failed to fetch booking:", err);
        if (!cancelled) setFetchError(err.message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [routeBookingId, user]);

  // Referral code, optional — same "buyer picks a referrer at payment time"
  // model already used for storage (app/(StorageForm)/ReferralStep.jsx),
  // now offered here too since accommodation/hubclip bookings never had a
  // chance to capture one.
  const [referralCode, setReferralCode] = useState("");
  const [referralChecking, setReferralChecking] = useState(false);
  const [referralMatch, setReferralMatch] = useState(null); // { id, firstname, surname }
  const [referralError, setReferralError] = useState(null);

  if (fetchError) {
    return (
      <View style={s.centered}>
        <Text style={s.errorText}>{fetchError}</Text>
      </View>
    );
  }

  if (!bookingData || !userInfo) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={COLORS.teal} />
      </View>
    );
  }

  const checkReferralCode = async () => {
    const trimmed = referralCode.trim();
    if (!trimmed || referralChecking) return;

    setReferralChecking(true);
    setReferralError(null);
    setReferralMatch(null);

    try {
      const token = await user.getIdToken(false);
      const res = await fetch(
        `${API_BASE_URL}/api/referral/validate?code=${encodeURIComponent(trimmed)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Couldn't check that code");
      if (!data.valid) {
        setReferralError(data.error || "No student found with that referral code.");
        return;
      }

      setReferralMatch(data.student);
    } catch (err) {
      setReferralError(err.message);
    } finally {
      setReferralChecking(false);
    }
  };

  const clearReferral = () => {
    setReferralCode("");
    setReferralMatch(null);
    setReferralError(null);
  };

  const accommodationInfo =
    bookingData.type === "hubclip"
      ? bookingData.hubclip
      : bookingData.accommodation;

  const {
    room_type,
    payment_option,
    status,
    booking_date,
    id: bookingId,
  } = bookingData;

  // payment_option on the booking record is the raw, owner-set price — the
  // same value the "All Bookings" card showed with the markup already
  // applied (AllBookings.jsx multiplies it before handing it to
  // BookingCard). This screen was showing the raw figure instead, so a
  // student would see one amount here and then get charged 5% more —
  // matching it to what's actually charged server-side.
  const amount = Number(payment_option || 0) * PLATFORM_MARKUP_RATE;

  /* ── Handlers ── */
  // Amount is computed server-side from the booking record — never sent
  // from the client.
  //
  // Plain function, not useCallback: bookingData now only exists after an
  // async fetch resolves, so the component renders once with it still null
  // (returning the loading view above) and again once it arrives. A Hook
  // declared after those conditional returns — as this useCallback was —
  // gets skipped on the first render and called on the second, which React
  // treats as a change in hook order and crashes with "Rendered fewer hooks
  // than expected." doPayment isn't passed to anything that needs referential
  // stability across renders, so it doesn't need to be memoized at all.
  const doPayment = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { authorization_url, reference } = await initiatePayment({
        user,
        type: bookingData.type === "hubclip" ? "hubclip" : "accommodation",
        payload: {
          bookingId,
          accommodationId: bookingData.accommodation_id,
          accommodationOwnerId: bookingData.accommodation_owner_id,
          referrerId: referralMatch?.id || null,
        },
      });

      const result = await confirm({ authorization_url, reference });

      if (result === "success") {
        // The bookings list only refetches on pull-to-refresh now (no more
        // silent refetch-on-focus) — without this, coming back from a
        // completed payment showed the exact same stale, unpaid booking
        // with "Pay Now" still on it, since nothing ever told
        // BookingsContext the payment had gone through. This is the one
        // moment we actually know that happened, so it refetches right
        // here instead of waiting on a focus event that no longer fires.
        try {
          await refetchBookings();
        } catch (err) {
          console.error("[PayNow] Failed to refresh bookings after payment:", err);
        }

        router.replace(
          "(bookings)/PaymentCompleted"
        );
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const isBusy = loading || busy;

  return (
    <View style={s.root}>
      {/* Header */}
      <View
        style={[
          s.headerBg,
          { paddingTop: insets.top },
        ]}
      >
        <Text style={s.headerTitle}>
          Complete payment
        </Text>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={[
          s.scrollContent,
          {
            paddingBottom:
              insets.bottom + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <PropertyCard
          accommodationInfo={accommodationInfo}
          room_type={room_type}
        />

        <BookingDetails
          booking_date={booking_date}
          status={status}
          accommodationInfo={
            accommodationInfo
          }
        />

        <AmountSection amount={amount} />

        <ReferralSection
          code={referralCode}
          onChangeCode={(text) => {
            setReferralCode(text);
            setReferralMatch(null);
            setReferralError(null);
          }}
          checking={referralChecking}
          match={referralMatch}
          error={referralError}
          onCheck={checkReferralCode}
          onClear={clearReferral}
        />

        {isBusy ? (
          <ActivityIndicator
            size="large"
            color={COLORS.teal}
            style={{
              marginVertical: 20,
            }}
          />
        ) : (
          <TouchableOpacity
            style={s.payBtn}
            onPress={doPayment}
            activeOpacity={0.85}
          >
            <Text style={s.payBtnText}>
              🔒 Pay GHS {amount.toFixed(2)}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default PayNow;

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 24,
  },

  errorText: {
    fontSize: 14,
    color: "#B91C1C",
    textAlign: "center",
  },

  headerBg: {
    backgroundColor: COLORS.teal,
    paddingBottom: 18,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
    marginTop: 12,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
  },

  payBtn: {
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 8,
  },

  payBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
});
