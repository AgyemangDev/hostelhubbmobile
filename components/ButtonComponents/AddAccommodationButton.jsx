// components/hubclipps/AddAccommodationButton.jsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AddAccommodationButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={() => router.push("/IntroductionScreen")}
    >
      <Ionicons name="add" size={24} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    top: 50,
    left: 20, // left side
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
