import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";
import Button from "../../components/ButtonComponents/ButtonComponent";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";
import { STORAGE_WHATSAPP_GROUP_URL } from "../../constants/storageWhatsapp";

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { resetReservation } = useStorageReservation();
  const animationRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const play = () => {
      if (animationRef.current && mounted) {
        animationRef.current.reset();
        animationRef.current.play();
      }
    };

    play();
    const interval = setInterval(play, 4000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const finish = async () => {
    await resetReservation();
    router.replace("(tabs)/(index)");
  };

  const joinWhatsappGroup = () => {
    Linking.openURL(STORAGE_WHATSAPP_GROUP_URL).catch(() => {});
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <LottieView
        ref={animationRef}
        source={require("../../assets/icons/accommodation_success.json")}
        autoPlay={false}
        loop={false}
        style={styles.animation}
      />

      <View style={styles.successSection}>
        <Text style={styles.title}>Storage Reserved 🎉</Text>
        <Text style={styles.subtitle}>
          Your storage booking has been confirmed and processed successfully.
        </Text>
      </View>

      {/* Receipt summary */}
      {(params?.amount || params?.transactionReference) && (
        <View style={styles.receiptCard}>
          {params?.amount && (
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Amount Paid</Text>
              <Text style={styles.receiptValueAmount}>
                GHS {Number(params.amount).toFixed(2)}
              </Text>
            </View>
          )}
          {params?.amount && params?.transactionReference && (
            <View style={styles.receiptDivider} />
          )}
          {params?.transactionReference && (
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Reference</Text>
              <Text style={styles.receiptValue}>{params.transactionReference}</Text>
            </View>
          )}
        </View>
      )}

      {/* What Happens Next */}
      <View style={styles.card}>
        <View style={styles.iconHeader}>
          <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
          <Text style={styles.cardTitle}>What Happens Next</Text>
        </View>

        <View style={styles.infoContent}>
          <InfoItem icon="mail" text="Your storage receipt has been sent to your email" />
          <InfoItem icon="cube" text="Our team will contact you to coordinate pickup and delivery" />
        </View>
      </View>

      {/* WhatsApp Group CTA */}
      <TouchableOpacity
        style={styles.whatsappCard}
        activeOpacity={0.85}
        onPress={joinWhatsappGroup}
      >
        <View style={styles.whatsappIconCircle}>
          <Ionicons name="logo-whatsapp" size={26} color="#25D366" />
        </View>
        <View style={styles.whatsappTextGroup}>
          <Text style={styles.whatsappTitle}>Join our Storage WhatsApp Group</Text>
          <Text style={styles.whatsappSubtitle}>
            Get pickup &amp; delivery updates straight to your phone
          </Text>
        </View>
        <View style={styles.whatsappButton}>
          <Text style={styles.whatsappButtonText}>Join</Text>
        </View>
      </TouchableOpacity>

      {/* Transport promo */}
      <View style={styles.promoCard}>
        <View style={styles.promoHeader}>
          <View style={styles.promoIcon}>
            <Ionicons name="bus" size={22} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.promoTitle}>Need Transport Home?</Text>
            <Text style={styles.promoDescription}>
              Move safely with our trusted, affordable services — all in one app.
            </Text>
          </View>
        </View>

        <View style={styles.benefits}>
          <Benefit icon="shield-checkmark" text="Safe & Verified" />
          <Benefit icon="time" text="Convenient Scheduling" />
          <Benefit icon="wallet" text="Affordable Pricing" />
        </View>
      </View>

      <Button
        buttonText="Go to Home"
        onPressFunction={finish}
        customStyle={styles.doneButton}
      />
    </ScrollView>
  );
}

/* ------------------ Helper Components ------------------ */

const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={16} color={COLORS.primary} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const Benefit = ({ icon, text }) => (
  <View style={styles.benefit}>
    <Ionicons name={icon} size={13} color={COLORS.primary} />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

/* ------------------ Styles ------------------ */

const CARD_RADIUS = 16;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    gap: 16,
  },
  animation: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },

  successSection: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: 10,
  },

  receiptCard: {
    backgroundColor: "#F5F6FF",
    borderRadius: CARD_RADIUS,
    padding: 18,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  receiptDivider: {
    height: 1,
    backgroundColor: "#E4E6FA",
    marginVertical: 12,
  },
  receiptLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  receiptValueAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: CARD_RADIUS,
    padding: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  iconHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  infoContent: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },

  whatsappCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25D366",
    borderRadius: CARD_RADIUS,
    padding: 16,
    gap: 12,
  },
  whatsappIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  whatsappTextGroup: {
    flex: 1,
  },
  whatsappTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 3,
  },
  whatsappSubtitle: {
    fontSize: 12,
    color: "#ecfdf5",
    lineHeight: 16,
  },
  whatsappButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
  },
  whatsappButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#128C7E",
  },

  promoCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: CARD_RADIUS,
    padding: 18,
  },
  promoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  promoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  promoDescription: {
    fontSize: 12.5,
    color: "#666",
    lineHeight: 17,
  },
  benefits: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  benefit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  benefitText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
  },

  doneButton: {
    width: "100%",
    marginTop: 4,
  },
});
