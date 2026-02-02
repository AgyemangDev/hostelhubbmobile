// _layout.js - Updated with FeedsProvider
import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { FeedsProvider } from "../../../context/FeedsContext";

const _layout = () => {
  return (

      <FeedsProvider>
        <Stack
          initialRouteName="index"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
      </FeedsProvider>
  );
};

// Styles for the header
const styles = StyleSheet.create({});

export default _layout;
