import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TEAL = "#0F6E56";
const TEAL_LIGHT = "#E1F5EE";

const STEPS = [
  { icon: "search-outline",          label: "Checking availability" },
  { icon: "document-text-outline",   label: "Preparing your reservation" },
  { icon: "bed-outline",             label: "Securing your bedspace" },
  { icon: "checkmark-circle-outline",label: "Almost done..." },
];

const ProcessingState = () => {
  const pulse = useRef(new Animated.Value(0.5)).current;
  const [stepIndex, setStepIndex] = React.useState(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated icon */}
      <Animated.View style={[styles.iconWrap, { opacity: pulse }]}>
        <Ionicons name="bed-outline" size={38} color={TEAL} />
      </Animated.View>

      <Text style={styles.heading}>Securing your booking</Text>
      <Text style={styles.sub}>Please keep this screen open</Text>

      {/* Step indicators */}
      <View style={styles.steps}>
        {STEPS.map((step, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <View key={i} style={styles.stepRow}>
              <View style={[styles.stepDot, done && styles.stepDotDone, active && styles.stepDotActive]}>
                {done
                  ? <Ionicons name="checkmark" size={12} color="#fff" />
                  : <View style={[styles.innerDot, active && styles.innerDotActive]} />
                }
              </View>
              <Text style={[styles.stepLabel, done && styles.stepLabelDone, active && styles.stepLabelActive]}>
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    gap: 8,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: TEAL_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "500",
    color: "#222",
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    color: "#999",
    marginBottom: 32,
  },
  steps: {
    width: "100%",
    gap: 16,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotDone: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  stepDotActive: {
    borderColor: TEAL,
    backgroundColor: "#fff",
  },
  innerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  innerDotActive: {
    backgroundColor: TEAL,
  },
  stepLabel: {
    fontSize: 14,
    color: "#bbb",
  },
  stepLabelDone: {
    color: "#999",
  },
  stepLabelActive: {
    color: "#222",
    fontWeight: "500",
  },
});

export default ProcessingState;