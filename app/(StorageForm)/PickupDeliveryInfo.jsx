"use client";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";
import DateSelector from "../../components/storage/DateSelector";
import LocationSelector from "../../components/storage/LocationSelector";
import SectionCard from "../../components/storage/SectionCard";
import ToggleRow from "../../components/storage/ToggleRow";
import LocationSummaryCard from "../../components/storage/LocationSummaryCard";
import { Button, PriceBar, StepHeader, money } from "../../components/ui/ds";
import { colors, space, type } from "../../constants/theme";
import { STORAGE_TOTAL_STEPS, stepOf } from "../../constants/storageSteps";
import { validatePickupDeliveryForm } from "../../utils/ValidationUtils/validatePickupDeliveryForm";
import API_BASE_URL from "../../utils/api/api";

export default function PickupDeliveryInfo() {
  const router = useRouter();
  const { reservation, updateReservation } = useStorageReservation();

  const [sameAsPickup, setSameAsPickup] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [points, setPoints] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const decideLater = !!reservation.deliveryInfo?.decideLater;
  const pickupInfo = reservation.pickupInfo;
  const deliveryInfo = reservation.deliveryInfo;

  // Pickup/delivery date ranges are admin-configurable from
  // /storage/manage on the management system — fetch the current range
  // instead of relying on dates hardcoded in the app.
  useEffect(() => {
    let isMounted = true;

    const loadSchedule = async () => {
      try {
        if (!reservation.school?.id) return;
        const res = await fetch(`${API_BASE_URL}/storage-schools/public`);
        if (!res.ok) return;

        const { schools = [] } = await res.json();
        const selectedSchool = schools.find((school) => school.id === reservation.school.id);
        const s = selectedSchool?.schedule;
        if (!isMounted || !s) return;
        setPoints(selectedSchool?.points || []);

        setSchedule({
          pickupMinDate: new Date(s.pickup_start_date),
          pickupMaxDate: new Date(s.pickup_end_date),
          deliveryMinDate: new Date(s.delivery_start_date),
          deliveryMaxDate: new Date(s.delivery_end_date),
        });
      } catch (err) {
        console.error("Failed to load storage schedule:", err);
      } finally {
        if (isMounted) setScheduleLoading(false);
      }
    };

    loadSchedule();
    return () => {
      isMounted = false;
    };
  }, [reservation.school?.id]);

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

  const total = (reservation.items || []).reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const header = <StepHeader step={stepOf("PickupDeliveryInfo")} total={STORAGE_TOTAL_STEPS} />;

  if (scheduleLoading || !schedule) {
    return (
      <SafeAreaView style={styles.screen}>
        {header}
        <View style={styles.loading}>
          {scheduleLoading ? <ActivityIndicator color={colors.brand} /> : null}
          <Text style={[type.body, { color: colors.textSecondary, textAlign: "center" }]}>
            {scheduleLoading
              ? `Loading the storage dates for ${reservation.school?.code || "your school"}…`
              : "Your school's storage dates aren't set yet. Please check back soon."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
    <SafeAreaView style={styles.screen}>
      {header}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={type.display} accessibilityRole="header">When should we come?</Text>

        <SectionCard first title="Pickup" subtitle="When and where we collect your items">
          <DateSelector
            placeholder="Pickup day"
            value={pickupInfo?.date}
            minDate={schedule.pickupMinDate}
            maxDate={schedule.pickupMaxDate}
            onChange={(date) => updateReservation({ pickupInfo: { ...pickupInfo, date } })}
          />
          <LocationSelector
            placeholder="Choose a pickup spot"
            value={pickupInfo}
            selectedType="pickup"
            points={points}
            onSelectLocation={(val) => updateReservation({ pickupInfo: { ...pickupInfo, ...val } })}
          />
        </SectionCard>

        <SectionCard title="Delivery" subtitle="When and where we bring them back">
          <ToggleRow
            label="Same spot as pickup"
            description="Uses your pickup hall, hostel and room."
            value={sameAsPickup}
            onValueChange={handleToggleSameAsPickup}
            disabled={decideLater}
          />
          <ToggleRow
            label="Decide later"
            description="Not sure where you'll stay next term? Add it from your booking."
            value={decideLater}
            onValueChange={handleToggleDecideLater}
          />
          <DateSelector
            placeholder="Delivery day"
            value={deliveryInfo?.date}
            minDate={schedule.deliveryMinDate}
            maxDate={schedule.deliveryMaxDate}
            onChange={(date) => updateReservation({ deliveryInfo: { ...deliveryInfo, date } })}
          />
          {decideLater ? null : sameAsPickup ? (
            <LocationSummaryCard info={pickupInfo} onEdit={() => setSameAsPickup(false)} />
          ) : (
            <LocationSelector
              placeholder="Choose a delivery spot"
              value={deliveryInfo}
              selectedType="delivery"
              points={points}
              onSelectLocation={(val) =>
                updateReservation({ deliveryInfo: { ...deliveryInfo, decideLater: false, ...val } })
              }
            />
          )}
        </SectionCard>
      </ScrollView>

      <PriceBar
        amount={money(total)}
        caption={pickupInfo?.date ? `Pickup ${pickupInfo.date}` : "Choose a pickup day"}
        action={<Button title="Continue" onPress={proceed} style={{ paddingHorizontal: space.xl }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", gap: space.md, padding: space.xl },
});
