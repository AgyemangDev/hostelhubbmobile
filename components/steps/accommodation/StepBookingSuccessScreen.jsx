import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Animated,
  StyleSheet,
} from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "../../ui";
import { colors } from "../../../constants/theme";

const TEAL = "#0F6E56";
const TEAL_LIGHT = "#E1F5EE";
const TEAL_MID = "#1D9E75";

const NEXT_STEPS = [
  {
    icon: "notifications-outline",
    lib: "Ionicons",
    title: "Watch for a notification",
    desc: "The hostel manager will review and respond to your request.",
  },
  {
    icon: "card-outline",
    lib: "Ionicons",
    title: "Make your payment",
    desc: "Once approved, pay through HostelHubb to secure your bedspace.",
  },
  {
    icon: "key-outline",
    lib: "Ionicons",
    title: "Move in",
    desc: "Present your confirmation to the hostel on arrival.",
  },
];

const StepBookingSuccessScreen = ({ hostelName, onDone }) => {
  const animationRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    animationRef.current?.play();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, delay: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Animation */}
      <LottieView
        ref={animationRef}
        source={require("../../../assets/icons/accommodation_success.json")}
        autoPlay={false}
        loop={false}
        style={styles.animation}
      />

      {/* Heading */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Text style={styles.title}>Booking submitted!</Text>
        <Text style={styles.subtitle}>
          Your reservation at{" "}
          <Text style={styles.hostelName}>{hostelName}</Text>{" "}
          is pending approval.
        </Text>
      </Animated.View>

      {/* What's next */}
      <Animated.View
        style={[
          styles.nextCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.sectionLabel}>What happens next</Text>

        {NEXT_STEPS.map((step, i) => (
          <View key={i} style={styles.nextRow}>
            <View style={styles.nextLeft}>
              <View style={styles.stepLine}>
                <View style={styles.stepDot} />
                {i < NEXT_STEPS.length - 1 && <View style={styles.stepConnector} />}
              </View>
            </View>
            <View style={styles.nextContent}>
              <View style={styles.nextIconRow}>
                <View style={styles.nextIconWrap}>
                  <Ionicons name={step.icon} size={16} color={TEAL} />
                </View>
                <Text style={styles.nextTitle}>{step.title}</Text>
              </View>
              <Text style={styles.nextDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Services teaser */}
      <Animated.View
        style={[
          styles.servicesCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.sectionLabel}>While you wait</Text>

        <View style={styles.serviceRow}>
          <View style={[styles.serviceIconWrap, { backgroundColor: TEAL_LIGHT }]}>
            <Ionicons name="bus-outline" size={20} color={TEAL} />
          </View>
          <View style={styles.serviceText}>
            <Text style={styles.serviceTitle}>Transport service</Text>
            <Text style={styles.serviceDesc}>Affordable student transport on resumption</Text>
          </View>
          <View style={styles.pillPopular}>
            <Text style={styles.pillText}>Popular</Text>
          </View>
        </View>

        <View style={[styles.serviceRow, { marginBottom: 0 }]}>
          <View style={[styles.serviceIconWrap, { backgroundColor: colors.warningBg }]}>
            <MaterialCommunityIcons name="package-variant-closed" size={20} color={colors.warningText} />
          </View>
          <View style={styles.serviceText}>
            <Text style={styles.serviceTitle}>Secure storage</Text>
            <Text style={styles.serviceDesc}>Keep your items safe during vacation</Text>
          </View>
          <View style={styles.pillTrusted}>
            <Text style={[styles.pillText, { color: colors.success }]}>Trusted</Text>
          </View>
        </View>
      </Animated.View>

      {/* CTA */}
      <Button title="Explore our services" icon="arrow-forward" iconPosition="right" onPress={onDone} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  animation: {
    width: 160,
    height: 160,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    color: colors.text,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 28,
  },
  hostelName: {
    color: TEAL,
    fontWeight: "500",
  },

  // Next steps
  nextCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 11,
    color: colors.textMuted,
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
    backgroundColor: TEAL,
    marginTop: 4,
  },
  stepConnector: {
    width: 1.5,
    flex: 1,
    backgroundColor: TEAL_LIGHT,
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
    backgroundColor: TEAL_LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  nextTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  nextDesc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
  },

  // Services
  servicesCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
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
    color: colors.text,
    marginBottom: 2,
  },
  serviceDesc: {
    fontSize: 12,
    color: colors.textMuted,
  },
  pillPopular: {
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillTrusted: {
    backgroundColor: colors.brandSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillText: {
    fontSize: 10,
    fontWeight: "500",
    color: TEAL,
  },

  // Button
  button: {
    width: "100%",
    backgroundColor: TEAL,
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: "500",
  },
});

export default StepBookingSuccessScreen;