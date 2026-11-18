import React, { useEffect, useRef, useContext } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export default function NoAccommodationScreen() {

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.emoji}>🏠</Text>

        <Text style={styles.title}>No accommodation available</Text>

        <Text style={styles.message}>
          We currently don’t have any accommodation listings for your filter list.
          {"\n\n"}
          Please check back later — we’re constantly adding new places.
        </Text>
      </Animated.View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────
const BG = "#F9FAFB";        // page background
const CARD = "#FFFFFF";     // card background
const TEXT = "#111827";     // primary text
const MUTED = "#6B7280";    // secondary text
const BORDER = "#E5E7EB";   // subtle border
const SHADOW = "#000000";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,

    // iOS shadow
    shadowColor: SHADOW,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,

    // Android shadow
    elevation: 6,
  },

  emoji: {
    fontSize: 42,
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 12,
    textAlign: "center",
  },

  message: {
    fontSize: 14,
    color: MUTED,
    textAlign: "center",
    lineHeight: 22,
  },
});