import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/Colors";
import Button from "../../../components/ButtonComponents/ButtonComponent";
import { useRouter } from "expo-router";

const WHAT_NEXT = [
  {
    icon: "mail-outline",
    title: "Check your email",
    desc: "A payment confirmation receipt has been sent to your email address.",
  },
  {
    icon: "call-outline",
    title: "Expect a call from HostelHubb",
    desc: "HostelHubb will send you your hostel receipt with your room number.",
  },
];

const PaymentCompleted = () => {
  const animationRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const playAnimation = () => {
      if (animationRef.current && isMounted) {
        animationRef.current.reset();
        animationRef.current.play();
      }
    };

    playAnimation();
    const interval = setInterval(playAnimation, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Success Animation */}
      <LottieView
        ref={animationRef}
        source={require("../../../assets/icons/accommodation_success.json")}
        autoPlay={false}
        loop={false}
        style={styles.animation}
      />

      {/* Success Message */}
      <View style={styles.successSection}>
        <Text style={styles.title}>Payment Completed!</Text>
        <Text style={styles.subtitle}>
          Your accommodation payment has been processed successfully.
        </Text>
      </View>

      {/* What Happens Next — Timeline Card */}
      <View style={styles.nextCard}>
        <Text style={styles.sectionLabel}>What happens next</Text>

        {WHAT_NEXT.map((step, i) => (
          <View key={i} style={styles.nextRow}>
            <View style={styles.nextLeft}>
              <View style={styles.stepLine}>
                <View style={styles.stepDot} />
                {i < WHAT_NEXT.length - 1 && (
                  <View style={styles.stepConnector} />
                )}
              </View>
            </View>
            <View style={styles.nextContent}>
              <View style={styles.nextIconRow}>
                <View style={styles.nextIconWrap}>
                  <Ionicons name={step.icon} size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.nextTitle}>{step.title}</Text>
              </View>
              <Text style={styles.nextDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Transport Service */}
      <View style={styles.servicesCard}>
        <Text style={styles.sectionLabel}>While you wait</Text>

        {/* Transport Row */}
        <View style={styles.serviceRow}>
          <View style={[styles.serviceIconWrap, { backgroundColor: COLORS.primaryLight || "#E1F5EE" }]}>
            <Ionicons name="bus-outline" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.serviceText}>
            <Text style={styles.serviceTitle}>Transport service</Text>
            <Text style={styles.serviceDesc}>
              Safe, affordable bus directly to campus
            </Text>
          </View>
          <View style={styles.pillPopular}>
            <Text style={styles.pillTextPrimary}>Popular</Text>
          </View>
        </View>

        {/* Support Row */}
        <View style={[styles.serviceRow, { marginBottom: 0 }]}>
          <View style={[styles.serviceIconWrap, { backgroundColor: "#FEF3E2" }]}>
            <Ionicons name="headset-outline" size={20} color="#854F0B" />
          </View>
          <View style={styles.serviceText}>
            <Text style={styles.serviceTitle}>24/7 Support</Text>
            <Text style={styles.serviceDesc}>
              Reach us anytime for help with your stay
            </Text>
          </View>
          <View style={styles.pillTrusted}>
            <Text style={styles.pillTextTrusted}>Always on</Text>
          </View>
        </View>
      </View>

      {/* Action Button */}
      <Button
        buttonText="Go home"
        onPressFunction={() => router.replace("(tabs)/(index)")}
        customStyle={styles.doneButton}
      />
    </ScrollView>
  );
};

export default PaymentCompleted;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  animation: {
    width: 160,
    height: 160,
    marginBottom: 8,
  },

  // Success Section
  successSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    color: "#111",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 21,
  },

  // Next Steps Card
  nextCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    padding: 16,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 11,
    color: "#999",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  nextRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  nextLeft: {
    width: 24,
    alignItems: "center",
  },
  stepLine: {
    alignItems: "center",
    flex: 1,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  stepConnector: {
    width: 1.5,
    flex: 1,
    backgroundColor: "#E1F5EE",
    marginVertical: 4,
    minHeight: 28,
  },
  nextContent: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 20,
  },
  nextIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  nextIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#E1F5EE",
    justifyContent: "center",
    alignItems: "center",
  },
  nextTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },
  nextDesc: {
    fontSize: 13,
    color: "#999",
    lineHeight: 19,
  },

  // Services Card
  servicesCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    padding: 16,
    marginBottom: 28,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  serviceIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceText: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#222",
    marginBottom: 2,
  },
  serviceDesc: {
    fontSize: 12,
    color: "#999",
  },
  pillPopular: {
    backgroundColor: "#E1F5EE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillTrusted: {
    backgroundColor: "#EAF3DE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillTextPrimary: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.primary,
  },
  pillTextTrusted: {
    fontSize: 10,
    fontWeight: "500",
    color: "#3B6D11",
  },

  // Button
  doneButton: {
    width: "100%",
  },
});