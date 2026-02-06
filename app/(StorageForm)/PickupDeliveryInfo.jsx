"use client";
import React from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";
import DateSelector from "../../components/Storage/DateSelector";
import LocationSelector from "../../components/Storage/LocationSelector";
import BottomButton from "../../components/ButtonComponents/BottomButton";
import COLORS from "../../constants/Colors";
import { validatePickupDeliveryForm } from "../../utils/ValidationUtils/validatePickupDeliveryForm";

export default function PickupDeliveryInfo() {
  const router = useRouter();
  const { reservation, updateReservation } = useStorageReservation();

  const proceed = () => {
    const error = validatePickupDeliveryForm({
      pickupInfo: reservation.pickupInfo,
      deliveryInfo: reservation.deliveryInfo,
    });

    if (error) {
      Alert.alert("Missing information", error);
      return;
    }

    router.push("ImageUpload");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Pickup & Delivery</Text>

        {/* PICKUP SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup</Text>
          
          <DateSelector
            label="Pickup date"
            placeholder="Select your pickup date"
            value={reservation.pickupInfo?.date}
            minDate={new Date("2026-04-23")}
            maxDate={new Date("2026-04-29")}
            onChange={(date) =>
              updateReservation({
                pickupInfo: {
                  ...reservation.pickupInfo,
                  date,
                },
              })
            }
          />

          <LocationSelector
            label="Pickup location"
            placeholder="Select pickup location"
            value={reservation.pickupInfo}
            onSelectLocation={(val) =>
              updateReservation({
                pickupInfo: {
                  ...reservation.pickupInfo,
                  ...val,
                },
              })
            }
          />
        </View>

        {/* DELIVERY SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery</Text>
          
          <DateSelector
            label="Delivery date"
            placeholder="Select your delivery date"
            value={reservation.deliveryInfo?.date}
            minDate={new Date("2026-04-23")}
            maxDate={new Date("2026-04-29")}
            onChange={(date) =>
              updateReservation({
                deliveryInfo: {
                  ...reservation.deliveryInfo,
                  date,
                },
              })
            }
          />

          <LocationSelector
            label="Delivery location"
            placeholder="Select delivery location"
            value={reservation.deliveryInfo}
            onSelectLocation={(val) =>
              updateReservation({
                deliveryInfo: {
                  ...reservation.deliveryInfo,
                  ...val,
                },
              })
            }
          />
        </View>
      </ScrollView>

      {/* STICKY BUTTON */}
      <View style={styles.stickyButton}>
        <BottomButton
          buttonText="Continue"
          onPressFunction={proceed}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    color: COLORS.textDark,
  },
  scroll: {
    padding: 16,
    paddingBottom: 140,
  },
  section: {
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || "#E5E5E5",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 16,
  },
  stickyButton: {
    position: "absolute",
    bottom: 10,
    left: 16,
    right: 16,
    backgroundColor: COLORS.white,
    paddingTop: 10,
  },
});