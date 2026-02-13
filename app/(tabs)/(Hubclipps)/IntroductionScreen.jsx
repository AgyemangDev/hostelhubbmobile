import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

import Button from "../../../components/ButtonComponents/ButtonComponent";
import TermsLink from "../../../components/Links/TermsLink";

const { width } = Dimensions.get("window");

const FEATURES = [
  {
    icon: "🏠",
    title: "Reach Verified Students",
    desc: "Your listing goes directly to a trusted network of students actively looking for rooms.",
  },
  {
    icon: "⚡",
    title: "Seamless Handover",
    desc: "We guide you through every step — from listing to handover — so nothing slips through.",
  },
  {
    icon: "🔒",
    title: "Safe & Trusted",
    desc: "Every user is verified. Your details stay protected throughout the entire process.",
  },
];

export default function IntroductionScreen() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  // Staggered entrance animations
  const fadeHeader  = useRef(new Animated.Value(0)).current;
  const slideHeader = useRef(new Animated.Value(24)).current;

  const fadeCards  = FEATURES.map(() => useRef(new Animated.Value(0)).current);
  const slideCards = FEATURES.map(() => useRef(new Animated.Value(20)).current);

  const fadeTerms = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeHeader,  { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideHeader, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.stagger(
        100,
        FEATURES.map((_, i) =>
          Animated.parallel([
            Animated.timing(fadeCards[i],  { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(slideCards[i], { toValue: 0, duration: 400, useNativeDriver: true }),
          ])
        )
      ),
      Animated.timing(fadeTerms, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinue = () => {
    if (!agreed) {
      Alert.alert("One more step", "Please read and accept the terms and conditions to continue.");
      return;
    }
    router.push("/AccommodationInfoScreen");
  };

  return (
    <View style={styles.wrapper}>
      {/* Decorative top-right blob */}
      <View style={styles.blobTop} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Header ── */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeHeader, transform: [{ translateY: slideHeader }] },
          ]}
        >
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>HubClipps · Listings</Text>
          </View>
          <Text style={styles.title}>List your room,{"\n"}find the right fit.</Text>
          <Text style={styles.subtitle}>
            Leaving your accommodation? Hand it over smoothly through HubClipps — the trusted student accommodation platform.
          </Text>
        </Animated.View>

        {/* ── Feature Cards ── */}
        <View style={styles.cardsSection}>
          {FEATURES.map((f, i) => (
            <Animated.View
              key={i}
              style={[
                styles.card,
                { opacity: fadeCards[i], transform: [{ translateY: slideCards[i] }] },
              ]}
            >
              <View style={styles.cardIconWrap}>
                <Text style={styles.cardIcon}>{f.icon}</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{f.title}</Text>
                <Text style={styles.cardDesc}>{f.desc}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* ── Terms Card ── */}
        <Animated.View style={[styles.termsCard, { opacity: fadeTerms }]}>
          <View style={styles.termsHeader}>
            <View style={styles.termsDot} />
            <Text style={styles.termsTitle}>Before you continue</Text>
          </View>

          <Text style={styles.termsBody}>
            By listing your accommodation on HubClipps, you agree to provide accurate
            information about your room and its availability. You are responsible for
            ensuring you have the right to sublet or transfer your accommodation contract.
            {"\n\n"}
            All listings will be reviewed to ensure they meet our community standards before appearing on our platform.
            You must respond to inquiries within 24 hours if we find a match for you.
            {"\n\n"}
            Read all of our terms and conditions by clicking on terms and conditions and agree before moving on.
          </Text>

          {/* Checkbox row — uses your TermsLink component */}
          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
              {agreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checkLabelRow}>
              <Text style={styles.checkLabel}>I agree to the </Text>
              <TermsLink
                link="https://hostelhubb.com/terms/hubclipps"
                text="terms and conditions"
              />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Spacer clears sticky bar */}
        <View style={{ height: 112 }} />
      </ScrollView>

      {/* ── Sticky Bottom Button — uses your Button component ── */}
      <View style={styles.stickyBar}>
        <Button
          buttonText="Continue"
          onPressFunction={handleContinue}
          variant={agreed ? "default" : "inverted"}
          customStyle={{ opacity: agreed ? 1 : 0.45 }}
        />
      </View>
    </View>
  );
}

/* ─────────────────────────────────────────
   Design tokens
───────────────────────────────────────── */
const CREAM      = "#FAF8F4";
const INK        = "#1A1A2E";
const BRAND      = "#2D6BE4";
const BRAND_LIGHT = "#EEF3FD";
const MUTED      = "#6B7280";
const BORDER     = "#E8E4DD";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  /* Background blob */
  blobTop: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: BRAND_LIGHT,
    opacity: 0.55,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 64,
  },

  /* ── Header ── */
  header: {
    marginBottom: 32,
  },
  badgePill: {
    alignSelf: "flex-start",
    backgroundColor: BRAND_LIGHT,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: BRAND,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: INK,
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: MUTED,
    lineHeight: 23,
    fontWeight: "400",
  },

  /* ── Feature Cards ── */
  cardsSection: {
    gap: 12,
    marginBottom: 28,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 14,
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: BRAND_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: { fontSize: 20 },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: INK,
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 19,
    fontWeight: "400",
  },

  /* ── Terms Card ── */
  termsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  termsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  termsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BRAND,
  },
  termsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: INK,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  termsBody: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 21,
    marginBottom: 20,
    fontWeight: "400",
  },

  /* Checkbox */
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: BORDER,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: {
    backgroundColor: BRAND,
    borderColor: BRAND,
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 14,
  },
  checkLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
  },
  checkLabel: {
    fontSize: 14,
    color: INK,
    fontWeight: "400",
  },

  /* ── Sticky Bottom Bar ── */
  stickyBar: {
    position: "absolute",
    bottom: -30,
    left: 0,
    right: 0,
    paddingHorizontal: 22,
    paddingBottom: 36,
    paddingTop: 16,
    backgroundColor: CREAM,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
});