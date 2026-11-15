import { Stack } from "expo-router";

// Transport has two interchangeable providers, each a self-contained flow:
//   unigo/   UniGo partner API (search, seats, pay, ticket)
//   legacy/  the original in-house buses
// index.jsx asks the backend which one is switched on (set from the
// management dashboard) and forwards there.
export default function TransportLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="unigo" />
      <Stack.Screen name="legacy" />
    </Stack>
  );
}
