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
      Alert.alert("Missing Information", error);
      return;
    }

    router.push("ImageUpload");
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Choose when and where we should collect and return your items
          </Text>
        </View>

        {/* PICKUP SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>📦</Text>
            </View>
            <Text style={styles.sectionTitle}>Pickup Information</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <DateSelector
              placeholder="Select your pickup date"
              value={reservation.pickupInfo?.date}
              minDate={new Date("2026-04-24")}
              maxDate={new Date("2026-04-25")}
              onChange={(date) =>
                updateReservation({
                  pickupInfo: {
                    ...reservation.pickupInfo,
                    date,
                  },
                })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <LocationSelector
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
        </View>

        {/* DELIVERY SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🚚</Text>
            </View>
            <Text style={styles.sectionTitle}>Delivery Information</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <DateSelector
              placeholder="Select your delivery date"
              value={reservation.deliveryInfo?.date}
              minDate={new Date("2026-05-23")}
              maxDate={new Date("2026-05-25")}
              onChange={(date) =>
                updateReservation({
                  deliveryInfo: {
                    ...reservation.deliveryInfo,
                    date,
                  },
                })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <LocationSelector
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
    backgroundColor: "#fff",
  },
  
  scroll: {
    padding: 20,
    paddingBottom: 140,
  },

  header: {
    marginBottom: 28,
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    lineHeight: 22,
  },

  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
  
    marginBottom: 16,

  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f9ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  iconText: {
    fontSize: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  inputGroup: {
    marginBottom: 20,
  },
  stickyButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
});