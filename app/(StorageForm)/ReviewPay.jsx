"use client";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import Button from "../../components/ButtonComponents/ButtonComponent";
import { useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";

export default function ReviewPay() {
  const router = useRouter();
  const { reservation } = useStorageReservation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Review Your Reservation</Text>

      {reservation.items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <Text style={styles.itemName}>
            {item.name} x {item.quantity}
          </Text>
          <Text style={styles.itemPrice}>${item.price}</Text>

          {item.image && (
            <Image
              source={{ uri: item.image.uri }}
              style={styles.imagePreview}
            />
          )}
        </View>
      ))}

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Pickup:</Text>
        <Text style={styles.infoValue}>{reservation.pickupInfo?.address}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Delivery:</Text>
        <Text style={styles.infoValue}>{reservation.deliveryInfo?.address}</Text>
      </View>

      <Button
        buttonText="Confirm & Pay"
        onPressFunction={() => router.push("SuccessScreen")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: "#f6f6f6",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  itemRow: {
    marginBottom: 20,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontWeight: "500",
    fontSize: 16,
    color: "#333",
  },
  infoValue: {
    fontSize: 16,
    color: "#555",
  },
});