import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack
      initialRouteName="shortlist"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="shortlist" />
    </Stack>
  );
};

export default _layout;
