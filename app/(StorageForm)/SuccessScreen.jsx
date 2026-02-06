"use client";
import { View, Text } from "react-native";
import Button from "../../components/ButtonComponents/ButtonComponent";
import { useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";

export default function SuccessScreen() {
  const router = useRouter();
  const { resetReservation } = useStorageReservation();

  const finish = async () => {
    await resetReservation();
    router.replace("/");
  };

  return (
    <View>
      <Text>🎉 Storage Reserved Successfully</Text>
      <Button buttonText="Done" onPressFunction={finish} />
    </View>
  );
}