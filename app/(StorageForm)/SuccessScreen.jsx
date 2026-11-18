import React, { useEffect, useRef } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";
import { STORAGE_WHATSAPP_GROUP_URL } from "../../constants/storageWhatsapp";
import { Button, FadeIn, ListRow, PriceBar, Timeline } from "../../components/ui";
import { money } from "../../utils/formatMoney";
import { colors, radius, space, type } from "../../constants/theme";

// PriceBar pads the bottom inset itself; padding it here too doubled the gap on iOS.
const SCREEN_EDGES = ["top", "left", "right"];

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { resetReservation } = useStorageReservation();
  const animationRef = useRef(null);

  useEffect(() => {
    // Plays once; the confirmation shouldn't loop on screen.
    animationRef.current?.play();
  }, []);

  const finish = async () => {
    await resetReservation();
    router.replace("/(tabs)/(index)");
  };

  const viewBookings = async () => {
    await resetReservation();
    router.replace("/(tabs)/(bookings)");
  };

  return (
    <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LottieView
          ref={animationRef}
          source={require("../../assets/icons/accommodation_success.json")}
          autoPlay={false}
          loop={false}
          style={styles.animation}
        />

        <FadeIn style={{ gap: space.xs, alignItems: "center" }}>
          <Text style={[type.display, { textAlign: "center" }]} accessibilityRole="header">Storage booked</Text>
          <Text style={[type.body, { color: colors.textSecondary, textAlign: "center" }]}>
            Your receipt is on its way to your email.
          </Text>
        </FadeIn>

        {params?.amount || params?.transactionReference ? (
          <View style={styles.receipt}>
            {params?.amount ? (
              <View style={styles.receiptRow}>
                <Text style={[type.caption, { color: colors.textSecondary }]}>Paid</Text>
                <Text style={type.price}>{money(params.amount)}</Text>
              </View>
            ) : null}
            {params?.transactionReference ? (
              <View style={styles.receiptRow}>
                <Text style={[type.caption, { color: colors.textSecondary }]}>Reference</Text>
                <Text style={[type.caption, { fontWeight: "700" }]} selectable>{params.transactionReference}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <Timeline
          steps={[
            { title: "Paid", subtitle: "Receipt sent to your email", state: "done" },
            { title: "Pickup", subtitle: "We'll message you the day before", state: "current" },
            { title: "In storage", state: "todo" },
            { title: "Delivered", state: "todo" },
          ]}
        />

        <View>
          <ListRow
            leading={
              <View style={styles.waIcon}>
                <Ionicons name="logo-whatsapp" size={22} color="#128C7E" />
              </View>
            }
            title="Join the storage WhatsApp group"
            subtitle="Pickup and delivery updates on your phone"
            onPress={() => Linking.openURL(STORAGE_WHATSAPP_GROUP_URL).catch(() => {})}
          />
          <ListRow
            icon="bus-outline"
            title="Need a bus home?"
            subtitle="Book a seat in Transport"
            onPress={async () => {
              await resetReservation();
              router.replace("/(categories)/(transport)");
            }}
            last
          />
        </View>
      </ScrollView>

      <PriceBar>
        <View style={{ flex: 1, flexDirection: "row", gap: space.sm }}>
          <Button title="Done" variant="secondary" onPress={finish} style={{ flex: 1 }} />
          <Button title="View booking" onPress={viewBookings} style={{ flex: 1.4 }} />
        </View>
      </PriceBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, gap: space.xl, paddingBottom: space.xxl },
  animation: { width: 140, height: 140, alignSelf: "center" },
  receipt: { gap: space.sm, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.surfaceSunken, borderWidth: 1, borderColor: colors.border },
  receiptRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: space.md },
  waIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.brandSoft, alignItems: "center", justifyContent: "center" },
});
