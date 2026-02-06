import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";
import Button from "../../components/ButtonComponents/ButtonComponent";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";

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

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Success Animation */}
      <LottieView
        ref={animationRef}
        source={require("../../assets/icons/accommodation_success.json")}
        autoPlay={false}
        loop={false}
        style={styles.animation}
      />

      {/* Success Message */}
      <View style={styles.successSection}>
        <Text style={styles.title}>Storage Reserved Successfully 🎉</Text>
        <Text style={styles.subtitle}>
          Your storage booking has been confirmed and processed successfully.
        </Text>

        {params?.amount && (
          <Text style={styles.amount}>
            Amount Paid: GHS {Number(params.amount).toFixed(2)}
          </Text>
        )}
      </View>

      {/* What Happens Next */}
      <View style={styles.infoCard}>
        <View style={styles.iconHeader}>
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={COLORS.primary}
          />
          <Text style={styles.cardTitle}>What Happens Next</Text>
        </View>

        <View style={styles.infoContent}>
          <InfoItem
            icon="mail"
            text="Your storage receipt has been sent to your email"
          />
          <InfoItem
            icon="cube"
            text="Our team will contact you to coordinate pickup and delivery"
          />
        </View>
      </View>

      {/* Transport & Storage Promotion */}
      <View style={styles.promoSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="bus" size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>
            Need Transport Home?
          </Text>
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoIcon}>
            <Ionicons name="bus" size={32} color="#fff" />
          </View>

          <Text style={styles.promoTitle}>
            Book Transport Easily
          </Text>

          <Text style={styles.promoDescription}>
            Move safely back to your house with our trusted,
            affordable services — all in one app.
          </Text>

          <View style={styles.benefits}>
            <Benefit icon="shield-checkmark" text="Safe & Verified" />
            <Benefit icon="time" text="Convenient Scheduling" />
            <Benefit icon="wallet" text="Affordable Pricing" />
          </View>
        </View>
      </View>

      {/* Action Button */}
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
    <Ionicons name={icon} size={14} color={COLORS.primary} />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

/* ------------------ Styles ------------------ */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  animation: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },

  successSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
    color: "#333",
  },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    elevation: 2,
  },
  iconHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
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
    fontSize: 15,
    color: "#555",
    flex: 1,
  },

  promoSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  promoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    alignItems: "center",
  },
  promoIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  promoDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  benefits: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  benefit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  benefitText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },

  doneButton: {
    width: "100%",
  },
});
