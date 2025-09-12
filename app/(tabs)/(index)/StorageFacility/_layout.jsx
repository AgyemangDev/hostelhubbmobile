import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      
    </Stack>
  );
};

export default _layout;
