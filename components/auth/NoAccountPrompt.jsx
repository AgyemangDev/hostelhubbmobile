import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ClientLogIn from "../../app/(Client)/ClientLogIn";
import COLORS from "../../constants/Colors";

const FEATURES = [
  { icon: "bed-outline",        label: "Hostel & Accommodation" },
  { icon: "cube-outline",       label: "Storage Solutions"      },
  { icon: "car-outline",        label: "Transport Booking"      },
  { icon: "school-outline",     label: "Built for Students"     },
];

const NoAccountPrompt = ({ message = "Join Hostelhubb today." }) => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <View style={styles.container}>

      {/* Logo mark */}
      <View style={styles.logoMark}>
        <Text style={styles.logoText}>H</Text>
      </View>

      <Text style={styles.title}>{message}</Text>
      <Text style={styles.sub}>
        Everything a student needs — accommodation, storage, and transport in one place.
      </Text>

      {/* Feature pills */}
      <View style={styles.features}>
        {FEATURES.map((f) => (
          <View key={f.label} style={styles.pill}>
            <Ionicons name={f.icon} size={14} color={COLORS.background} />
            <Text style={styles.pillText}>{f.label}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.button} onPress={() => setShowLogin(true)} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowLogin(true)}>
        <Text style={styles.secondaryText}>Already have an account? <Text style={styles.secondaryLink}>Sign in</Text></Text>
      </TouchableOpacity>

      <Modal
        visible={showLogin}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLogin(false)}
      >
        <ClientLogIn onClose={() => setShowLogin(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    backgroundColor: "#fff",
    gap: 10,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: COLORS.logoShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginVertical: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fdf0f0",
    borderWidth: 1,
    borderColor: "#f5d0d0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 12,
    color: COLORS.background,
    fontWeight: "500",
  },
  button: {
    backgroundColor: COLORS.background,
    paddingVertical: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
    shadowColor: COLORS.logoShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  secondaryButton: {
    paddingVertical: 10,
  },
  secondaryText: {
    color: "#aaa",
    fontSize: 13,
  },
  secondaryLink: {
    color: COLORS.background,
    fontWeight: "600",
  },
});

export default NoAccountPrompt;