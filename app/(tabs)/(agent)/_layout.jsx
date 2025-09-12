// _layout.js - Updated with FeedsProvider
import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { AgentProvider } from "../../../context/AgentContext";
import { FeedsProvider } from "../../../context/FeedsContext";

const _layout = () => {
  return (
    <AgentProvider>
      <FeedsProvider>
        <Stack
          initialRouteName="index"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="AgentDetailScreen" />
          <Stack.Screen name="BecomeAgentScreen" />
        </Stack>
      </FeedsProvider>
    </AgentProvider>
  );
};

// Styles for the header
const styles = StyleSheet.create({});

export default _layout;
