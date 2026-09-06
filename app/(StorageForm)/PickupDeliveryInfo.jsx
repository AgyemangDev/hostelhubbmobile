"use client";
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";
import DateSelector from "../../components/Storage/DateSelector";
import LocationSelector from "../../components/Storage/LocationSelector";
import BottomButton from "../../components/ButtonComponents/BottomButton";
import SectionCard from "../../components/Storage/SectionCard";
import ToggleRow from "../../components/Storage/ToggleRow";
import LocationSummaryCard from "../../components/Storage/LocationSummaryCard";
import COLORS from "../../constants/Colors";
import { validatePickupDeliveryForm } from "../../utils/ValidationUtils/validatePickupDeliveryForm";

const PICKUP_MIN_DATE = new Date("2026-09-06");
const PICKUP_MAX_DATE = new Date("2026-09-06");
const DELIVERY_MIN_DATE = new Date("2026-10-17");
const DELIVERY_MAX_DATE = new Date("2026-10-18");

export default function PickupDeliveryInfo() {
  const router = useRouter();
  const { reservation, updateReservation } = useStorageReservation();

  const [sameAsPickup, setSameAsPickup] = useState(false);
  const decideLater = !!reservation.deliveryInfo?.decideLater;
  const pickupInfo = reservation.pickupInfo;
  const deliveryInfo = reservation.deliveryInfo;

  // Keep the delivery address perpetually in sync with pickup while the
  // toggle is on — not just at the moment the user flips it. This means
  // editing the pickup hall/room later automatically carries through.
  useEffect(() => {
    if (!sameAsPickup || decideLater) return;
    if (!pickupInfo?.area) return;

    const alreadyInSync =
      deliveryInfo?.area === pickupInfo.area &&
      deliveryInfo?.offCampusArea === pickupInfo.offCampusArea &&
      deliveryInfo?.hostel === pickupInfo.hostel &&
      deliveryInfo?.room === pickupInfo.room;

    if (alreadyInSync) return;

    updateReservation({
      deliveryInfo: {
        ...deliveryInfo,
        decideLater: false,
        area: pickupInfo.area,
        offCampusArea: pickupInfo.offCampusArea,
        hostel: pickupInfo.hostel,
        room: pickupInfo.room,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sameAsPickup,
    decideLater,
    pickupInfo?.area,
    pickupInfo?.offCampusArea,
    pickupInfo?.hostel,
    pickupInfo?.room,
  ]);

  const proceed = () => {
    const error = validatePickupDeliveryForm({ pickupInfo, deliveryInfo });

    if (error) {
      Alert.alert("Missing information", error);
      return;
    }

    router.push("ImageUpload");
  };

  const handleToggleSameAsPickup = (next) => {
    if (next && !pickupInfo?.area) {
      Alert.alert("Pickup location needed", "Please set your pickup location first.");
      return;
    }
    setSameAsPickup(next);
  };

  const handleToggleDecideLater = (next) => {
    if (next) setSameAsPickup(false);

    updateReservation({
      deliveryInfo: {
        ...deliveryInfo,
        decideLater: next,
        ...(next && {
          area: null,
          offCampusArea: null,
          hostel: "",
          room: "",
        }),
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Pickup &amp; delivery</Text>
          <Text style={styles.subtitle}>
            Choose when and where we should collect and return your items.
          </Text>
        </View>

        <SectionCard icon="cube-outline" title="Pickup" subtitle="Where we'll collect your items">
          <DateSelector
            placeholder="Pickup date"
            value={pickupInfo?.date}
            minDate={PICKUP_MIN_DATE}
            maxDate={PICKUP_MAX_DATE}
            onChange={(date) =>
              updateReservation({ pickupInfo: { ...pickupInfo, date } })
            }
          />

          <LocationSelector
            placeholder="Select pickup location"
            value={pickupInfo}
            selectedType="pickup"
            onSelectLocation={(val) =>
              updateReservation({ pickupInfo: { ...pickupInfo, ...val } })
            }
          />
        </SectionCard>

        <SectionCard icon="car-outline" title="Delivery" subtitle="Where we'll return your items">
          <View style={styles.toggleGroup}>
            <ToggleRow
              label="Deliver to the same location"
              description="Reuses your pickup hall, hostel and room automatically."
              value={sameAsPickup}
              onValueChange={handleToggleSameAsPickup}
              disabled={decideLater}
            />
            <View style={styles.toggleDivider} />
            <ToggleRow
              label="I don't know my delivery hostel yet"
              description="You can add it later — we'll follow up before the return date."
              value={decideLater}
              onValueChange={handleToggleDecideLater}
            />
          </View>

          <DateSelector
            placeholder="Delivery date"
            value={deliveryInfo?.date}
            minDate={DELIVERY_MIN_DATE}
            maxDate={DELIVERY_MAX_DATE}
            onChange={(date) =>
              updateReservation({ deliveryInfo: { ...deliveryInfo, date } })
            }
          />

          {decideLater ? null : sameAsPickup ? (
            <LocationSummaryCard
              info={pickupInfo}
              onEdit={() => setSameAsPickup(false)}
            />
          ) : (
            <LocationSelector
              placeholder="Select delivery location"
              value={deliveryInfo}
              selectedType="delivery"
              onSelectLocation={(val) =>
                updateReservation({
                  deliveryInfo: { ...deliveryInfo, decideLater: false, ...val },
                })
              }
            />
          )}
        </SectionCard>
      </ScrollView>

      <View style={styles.footer}>
        <BottomButton buttonText="Continue" onPressFunction={proceed} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scroll: {
    padding: 20,
    paddingBottom: 120,
    gap: 16,
  },

  header: {
    marginBottom: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14.5,
    color: COLORS.textMuted,
    lineHeight: 21,
  },

  toggleGroup: {
    borderRadius: 14,
    paddingVertical: 6,
  },

  toggleDivider: {
    height: 1,
    backgroundColor: "#ECECEC",
    marginVertical: 10,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 4,
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
});