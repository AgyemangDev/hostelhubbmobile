import React from "react";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { IconButton } from "../../../../components/ui";
import { colors } from "../../../../constants/theme";

const _layout = () => {
  const router = useRouter();


  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerStyle: { backgroundColor: colors.brand },
        headerTintColor: colors.textInverse,
        headerTitleStyle: { fontWeight: "600", fontSize: 18, color: colors.textInverse },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTitleAlign: "center",
        gestureEnabled: false,
        headerLeft: () => <IconButton icon="arrow-back" color={colors.textInverse} accessibilityLabel="Go back" onPress={() => router.back()} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Board Make we Move",
          headerLeft: () => null, // ✅ No back button on first screen
        }}
      />
      <Stack.Screen
        name="BusSelection"
        options={{
          headerShown: true,
          title: "Select Your Bus",
        }}
      />
      <Stack.Screen
        name="SeatSelection"
        options={{
          headerShown: false,
          title: "Board Make we Move",
        }}
      />
      <Stack.Screen
        name="StorageCompartment"
        options={{
          headerShown: true,
          title: "Storage Compartment",
        }}
      />
      <Stack.Screen
        name="PaymentScreen"
        options={{
          headerShown: true,
          title: "Pay to Confirm",
        }}
      />
    </Stack>
  );
};

export default _layout;