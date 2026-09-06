import React from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../ButtonComponents/ButtonComponent";
import styles from "../../app/(Client)"; // adjust path if needed, for primaryButton

export default function BookingsClosedModal({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <View style={s.card}>
          <Ionicons
            name="alert-circle-outline"
            size={32}
            color="#0f766e"
            style={{ marginBottom: 10 }}
          />
          <Text style={s.title}>Bookings Closed</Text>
          <Text style={s.text}>
            Unfortunately, we've closed bookings for this vacation period. Thank you for your understanding!
          </Text>
          <Button
            buttonText="Got it"
            onPressFunction={onClose}
            customStyle={styles.primaryButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
});