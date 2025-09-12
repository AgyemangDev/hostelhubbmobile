import React from "react";
import { Stack } from "expo-router";

const ProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#610b0c",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          color: "#fff",
        },
        headerBackTitleVisible: false, // Globally hides the back title
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
          title: "Report Your Concern",
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
          title: "HostelHubb Referral Program",
        }}
      />
       <Stack.Screen
        name="contactHostel"
        options={{
          headerShown: true,
          title: "Contact Us",
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
