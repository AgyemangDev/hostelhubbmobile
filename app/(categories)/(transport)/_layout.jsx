import React from "react";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const _layout = () => {
  const router = useRouter();

  const CustomBackButton = () => (
    <TouchableOpacity
      onPress={() => router.replace("(tabs)/(index)")}
      style={{
        width: 30,
        height: 30,
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
      }}
    >
      <FontAwesome name="arrow-left" size={20} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerStyle: { backgroundColor: "#610b0c" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "600", fontSize: 18, color: "#fff" },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerLeft: () => <CustomBackButton />,
        headerTitleAlign: "center",
        gestureEnabled: false, // ✅ disable swipe back gesture
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Board Make we Move", // ✅ custom title
        }}
      />
    </Stack>
  );
};

export default _layout;