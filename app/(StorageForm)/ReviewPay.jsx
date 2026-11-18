import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import * as FileSystem from "expo-file-system/legacy";

import { Ionicons } from "@expo/vector-icons";
import { Button, DetailRow, Divider, FadeIn, PriceBar, StepHeader } from "../../components/ui";
import { money } from "../../utils/formatMoney";
import { colors, radius, space, type } from "../../constants/theme";
import { STORAGE_TOTAL_STEPS, stepOf } from "../../constants/storageSteps";

const place = (info) => {
  if (!info?.area) return null;
  const parts = info.area === "Off Campus" ? [info.hostel, info.offCampusArea] : [info.area];
  if (info.room) parts.push(`Room ${info.room}`);
  return parts.filter(Boolean).join(" · ");
};
const day = (value) => {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("en-GH", { weekday: "short", day: "numeric", month: "short" });
};

import { initiatePayment } from "../../services/paymentService";
import { usePaymentConfirmation } from "../../hooks/usePaymentConfirmation";

// PriceBar pads the bottom inset itself; padding it here too doubled the gap on iOS.
const SCREEN_EDGES = ["top", "left", "right"];

export default function ReviewPay() {
  const router = useRouter();
  const { reservation, resetReservation } = useStorageReservation();

  const { user } = useContext(UserContext);
  const { confirm, busy } = usePaymentConfirmation();
  const [loading, setLoading] = useState(false);

  const totalAmount = reservation.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const confirmAndPay = async () => {
    if (!user) {
      Alert.alert("Error", "No logged-in user found.");
      return;
    }

    try {
      setLoading(true);
      if (!reservation.school?.id) {
        Alert.alert("School required", "Please select your school before paying.");
        return;
      }

      // Same payload shape the old processStoragePayment built server-side —
      // the backend still computes the charge amount from `items` itself.
      let groupImage = null;
      if (reservation.groupImage?.uri) {
        try {
          const base64 = await FileSystem.readAsStringAsync(
            reservation.groupImage.uri,
            { encoding: "base64" }
          );

          if (base64) {
            groupImage = {
              base64,
              mimeType: reservation.groupImage.mimeType || "image/jpeg",
              fileName: reservation.groupImage.fileName || "photo.jpg",
            };
          }
        } catch (err) {
          console.warn("[ReviewPay] Could not read image file:", err.message);
        }
      }

      const payload = {
        // Only ids and quantities: the server prices items from storage_items.
        items: reservation.items.map(({ id, quantity }) => ({ id, quantity })),
        pickupInfo: reservation.pickupInfo,
        deliveryInfo: reservation.deliveryInfo,
        schoolId: reservation.school.id,
        groupImage,
        referrerId:
          reservation.referral?.status === "confirmed"
            ? reservation.referral.referrerId
            : null,
      };

      const { authorization_url, reference, amount: chargedAmount } = await initiatePayment({
        user,
        type: "storage",
        payload,
      });

      const result = await confirm({ authorization_url, reference });

      if (result === "success") {
        // ✅ RESET STORAGE FLOW HERE
        await resetReservation();

        // ✅ Navigate AFTER reset
        router.replace({
          pathname: "SuccessScreen",
          params: {
            transactionReference: reference,
            amount: chargedAmount ?? totalAmount,
          },
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      Alert.alert("Payment Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const isBusy = loading || busy;
  const { pickupInfo, deliveryInfo, referral, groupImage } = reservation;
  const deliveryLine = deliveryInfo?.decideLater
    ? `You'll choose the spot later${deliveryInfo?.date ? ` · ${day(deliveryInfo.date)}` : ""}`
    : [day(deliveryInfo?.date), place(deliveryInfo)].filter(Boolean).join(" · ");


  return (
    <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
      <StepHeader step={stepOf("ReviewPay")} total={STORAGE_TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={type.display} accessibilityRole="header">Review and pay</Text>

        <FadeIn style={{ gap: space.md }}>
          <DetailRow variant="stacked" placeholder="Not set" label="SCHOOL" value={reservation.school?.name} />
          <DetailRow variant="stacked" placeholder="Not set" label="PICKUP" value={[day(pickupInfo?.date), place(pickupInfo)].filter(Boolean).join(" · ")} onEdit={() => router.navigate("PickupDeliveryInfo")} />
          <DetailRow variant="stacked" placeholder="Not set" label="DELIVERY" value={deliveryLine} onEdit={() => router.navigate("PickupDeliveryInfo")} />
        </FadeIn>

        <Divider />

        <View style={{ gap: space.sm }}>
          {reservation.items.map((item) => (
            <View key={item.id} style={styles.line}>
              <Text style={type.body}>{item.name} × {item.quantity}</Text>
              <Text style={type.body}>{money(Number(item.price) * item.quantity)}</Text>
            </View>
          ))}
          <View style={[styles.line, styles.totalLine]}>
            <Text style={[type.bodyStrong, { fontWeight: "800" }]}>Total</Text>
            <Text style={[type.bodyStrong, { fontWeight: "800" }]}>{money(totalAmount)}</Text>
          </View>
        </View>

        <View style={styles.extras}>
          {groupImage?.uri ? <Image source={{ uri: groupImage.uri }} style={styles.thumb} accessibilityLabel="Your items photo" /> : null}
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={type.bodyStrong}>{groupImage?.uri ? "Items photo added" : "No photo"}</Text>
            <Text style={[type.caption, { color: colors.textSecondary }]}>
              {referral?.status === "confirmed"
                ? `Referred by ${[referral.firstname, referral.surname].filter(Boolean).join(" ")}`
                : "No referral code"}
            </Text>
          </View>
        </View>

        <View style={styles.secure}>
          <Ionicons name="lock-closed-outline" size={16} color={colors.textSecondary} />
          <Text style={[type.caption, { color: colors.textSecondary, flex: 1 }]}>
            Paid securely with Paystack: mobile money or card. The final amount is confirmed by HostelHubb at checkout.
          </Text>
        </View>
      </ScrollView>

      <PriceBar action={<Button title={isBusy ? "Confirming payment…" : `Pay ${money(totalAmount)}`} loading={isBusy} onPress={confirmAndPay} />} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl },
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
  line: { flexDirection: "row", justifyContent: "space-between", gap: space.md },
  totalLine: { paddingTop: space.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderStrong },
  extras: { flexDirection: "row", alignItems: "center", gap: space.sm, padding: space.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  thumb: { width: 52, height: 52, borderRadius: radius.sm, backgroundColor: colors.fill },
  secure: { flexDirection: "row", gap: space.xs, alignItems: "flex-start" },
});
