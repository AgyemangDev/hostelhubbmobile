"use client";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { HubclippsProvider } from "../../../context/AddHubclippsContext";

// Custom Back Button
const BackButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={24} color="black" />
    </TouchableOpacity>
  );
};

const _layout = () => {
  return (
    <HubclippsProvider>
      <Stack>
        {/* Landing / Index */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Introduction */}
        <Stack.Screen
          name="IntroductionScreen"
          options={{
            headerLeft: () => <BackButton />,
            title: "Welcome To HubClipps",
          }}
        />

        {/* Accommodation Info */}
        <Stack.Screen
          name="AccommodationInfoScreen"
          options={{
            headerLeft: () => <BackButton />,
            title: "Accommodation Info",
          }}
        />

        {/* Manager Info */}
        <Stack.Screen
          name="ManagerInfoScreen"
          options={{
            headerLeft: () => <BackButton />,
            title: "Manager Info",
          }}
        />

        {/* Media Upload */}
        <Stack.Screen
          name="MediaScreen"
          options={{
            headerLeft: () => <BackButton />,
            title: "Upload Media",
          }}
        />

            {/* Success Screen */}
        <Stack.Screen
          name="Preview"
          options={{
           headerLeft: () => <BackButton />,
            title: "Preview and Publish",
          }}
        />
      </Stack>
    </HubclippsProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({
  backButton: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
