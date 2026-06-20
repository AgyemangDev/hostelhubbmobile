import React, { useContext, useState, useCallback } from "react";
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
import { processPayment } from "../../../hooks/transactions/paymentService";
import COLORS from "../../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  PropertyCard,
  BookingDetails,
  AmountSection,
  BankTransferSection,
} from "../../../components/PayNowComponents/payNowComponent";

import TopUpPromptModal from "../../../components/modals/TopUpPromptModal";

/* ─── Main screen ─────────────────────────────────────────────────────────── */
const PayNow = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, userInfo } = useContext(UserContext);

  const params = useLocalSearchParams();
  const bookingData = params.booking
    ? JSON.parse(params.booking)
    : null;

  const [loading, setLoading] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  if (!bookingData || !userInfo) return null;

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

  const amount = Number(payment_option || 0);
  const userBalance = Number(userInfo?.balance || 0);
  const hasFunds = userBalance >= amount;

  /* ── Handlers ── */
  const handlePayPress = () => {
    if (!hasFunds) {
      setShowTopUpModal(true);
      return;
    }

    doPayment();
  };

  const doPayment = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const token = await user.getIdToken(false);

      const success = await processPayment({
        amount,
        bookingId,
        accommodationId:
          bookingData.accommodation_id,
        accommodationOwnerId:
          bookingData.accommodation_owner_id,
        token,
      });

      if (success) {
        router.replace(
          "(bookings)/PaymentCompleted"
        );
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  }, [amount, bookingId, bookingData, user]);

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

        <AmountSection
          amount={amount}
          userBalance={userBalance}
          hasFunds={hasFunds}
        />

        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.teal}
            style={{
              marginVertical: 20,
            }}
          />
        ) : (
          <TouchableOpacity
            style={[
              s.payBtn,
              !hasFunds &&
                s.payBtnInsufficient,
            ]}
            onPress={handlePayPress}
            activeOpacity={0.85}
          >
            <Text style={s.payBtnText}>
              {hasFunds
                ? `🔒 Pay GHS ${amount.toFixed(
                    2
                  )}`
                : "💳 Top up & pay"}
            </Text>
          </TouchableOpacity>
        )}

        <BankTransferSection
          amount={amount}
          bookingId={bookingId}
          userInfo={userInfo}
        />
      </ScrollView>

      <TopUpPromptModal
        visible={showTopUpModal}
        onClose={() =>
          setShowTopUpModal(false)
        }
        onTopUp={() => {
          setShowTopUpModal(false);

          // Change this route if your wallet
          // screen lives elsewhere
          router.push("(ProfileScreens)/transactions");
        }}
        userBalance={userBalance}
        amount={amount}
      />
    </View>
  );
};

export default PayNow;

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F3F4F6",
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

  payBtnInsufficient: {
    backgroundColor: COLORS.gold,
  },

  payBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
});