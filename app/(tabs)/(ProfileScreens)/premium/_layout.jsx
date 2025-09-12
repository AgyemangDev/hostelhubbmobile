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
        headerBackTitleVisible: "false",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerBackTitle: "",
        }}
      />
      <Stack.Screen
        name="cinemaplus"
        options={{
          headerShown: false,
          title: "Cinema +",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="services"
        options={{
          headerShown: false,
          title: "Personal Info",
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
