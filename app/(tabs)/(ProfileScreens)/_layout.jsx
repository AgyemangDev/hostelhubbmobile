import React from "react";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ProfileLayout = () => {
  const router = useRouter();

  const CustomBackButton = () => (
    <TouchableOpacity
      onPress={() => router.back()}
      style={{
        width: 30,
        height: 30,
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
        marginBottom:3
      }}
    >
      <FontAwesome name="arrow-left" size={20} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#610b0c",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
          color: "#fff",
        },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerLeft: () => <CustomBackButton />,
        headerTitleAlign: "center",
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="personalInfo"
        options={{
          headerShown: true,
          title: "Personal Info",
        }}
      />
      <Stack.Screen
        name="howHostelHubbWorks"
        options={{
          headerShown: false,
          title: "How the App Works",
        }}
      />
      <Stack.Screen
        name="reportAConcern"
        options={{
          headerShown: true,
          title: "Report Concern",
        }}
      />
      <Stack.Screen
        name="reviews"
        options={{
          headerShown: true,
          title: "Reviews",
        }}
      />
      <Stack.Screen
        name="transactions"
        options={{
          headerShown: true,
          title: "Transactions",
        }}
      />
      <Stack.Screen
        name="referralInfo"
        options={{
          headerShown: true,
          title: "Referral Program",
        }}
      />
      <Stack.Screen
        name="contactHostel"
        options={{
          headerShown: true,
          title: "About Us",
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;