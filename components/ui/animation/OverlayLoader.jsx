// components/OverlayLoader.jsx
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Modal } from "react-native";

const OverlayLoader = ({ visible = false, message = "Processing payment..." }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default OverlayLoader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  message: {
    color: "#fff",
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
});
