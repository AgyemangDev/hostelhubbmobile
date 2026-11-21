"use client";
import React, { useState, useEffect, useRef } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";
import DateSelector from "../../components/forms/storage/DateSelector";
import LocationSelector from "../../components/forms/storage/LocationSelector";
import LocationSummaryCard from "../../components/cards/storage/LocationSummaryCard";
import { Button, PriceBar, Section, StepHeader, ToggleRow, KeyboardView } from "../../components/ui";
import { money } from "../../utils/formatMoney";
import { colors, space, type } from "../../constants/theme";
import { STORAGE_TOTAL_STEPS, stepOf } from "../../constants/storageSteps";
import { getPickupDeliveryIssues } from "../../utils/ValidationUtils/validatePickupDeliveryForm";
import PickupDeliverySkeleton from "../../components/skeletons/storage/PickupDeliverySkeleton";
import API_BASE_URL from "../../utils/api/api";

// PriceBar pads the bottom inset itself; padding it here too doubled the gap on iOS.
const SCREEN_EDGES = ["top", "left", "right"];

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

  // Field errors only show after the first Continue attempt, then update
  // live so each one clears as soon as it's filled in.
  const [showErrors, setShowErrors] = useState(false);
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const fieldRefs = useRef({});
  const registerField = (key) => (node) => {
    if (node) fieldRefs.current[key] = node;
    else delete fieldRefs.current[key];
  };
  const issues = getPickupDeliveryIssues({ pickupInfo, deliveryInfo });
  const errorFor = (key) => {
    if (!showErrors) return undefined;
    const hit = issues.find((i) => i.key === key);
    return hit ? `Add your ${hit.label.toLowerCase()}` : undefined;
  };
  const locationErrors = (prefix) =>
    ["area", "offCampusArea", "hostel", "room"].reduce((acc, f) => ({ ...acc, [f]: errorFor(`${prefix}.${f}`) }), {});

  const scrollToField = (key) => {
    const node = fieldRefs.current[key];
    if (!node || !contentRef.current || !scrollRef.current) return;
    node.measureLayout(
      contentRef.current,
      (_x, y) => scrollRef.current?.scrollTo({ y: Math.max(y - space.lg, 0), animated: true }),
      () => {}
    );
  };

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

  if (scheduleLoading) {
    return (
      <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
        {header}
        <PickupDeliverySkeleton />
      </SafeAreaView>
    );
  }

  if (!schedule) {
    return (
      <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
        {header}
        <View style={styles.loading}>
          <Text style={[type.body, { color: colors.textSecondary, textAlign: "center" }]}>
            Your school's storage dates aren't set yet. Please check back soon.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const proceed = () => {
    if (issues.length) {
      setShowErrors(true);
      const first = issues[0].key;
      Alert.alert(
        issues.length === 1 ? `Add your ${issues[0].label.toLowerCase()}` : "A few details are missing",
        issues.length === 1
          ? "Fill it in to continue."
          : `Please add:\n\n${issues.map((i) => `• ${i.label}`).join("\n")}`,
        [{ text: "OK", onPress: () => scrollToField(first) }]
      );
      // Start scrolling straight away too, so the field is in view behind the alert.
      requestAnimationFrame(() => scrollToField(first));
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
    <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
      {header}
      <KeyboardView>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View ref={contentRef} collapsable={false} style={styles.scroll}>
          <Text style={type.display} accessibilityRole="header">When should we come?</Text>

          <Section variant="divided" first title="Pickup" subtitle="When and where we collect your items">
            <View ref={registerField("pickup.date")} collapsable={false}>
              <DateSelector
                placeholder="Pickup day"
                error={errorFor("pickup.date")}
                value={pickupInfo?.date}
                minDate={schedule.pickupMinDate}
                maxDate={schedule.pickupMaxDate}
                onChange={(date) => updateReservation({ pickupInfo: { ...pickupInfo, date } })}
              />
            </View>
            <LocationSelector
              placeholder="Choose a pickup spot"
              errors={locationErrors("pickup")}
              registerField={(f, node) => registerField(`pickup.${f}`)(node)}
              value={pickupInfo}
              selectedType="pickup"
              points={points}
              onSelectLocation={(val) => updateReservation({ pickupInfo: { ...pickupInfo, ...val } })}
            />
          </Section>

          <Section variant="divided" title="Delivery" subtitle="When and where we bring them back">
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
            <View ref={registerField("delivery.date")} collapsable={false}>
              <DateSelector
                placeholder="Delivery day"
                error={errorFor("delivery.date")}
                value={deliveryInfo?.date}
                minDate={schedule.deliveryMinDate}
                maxDate={schedule.deliveryMaxDate}
                onChange={(date) => updateReservation({ deliveryInfo: { ...deliveryInfo, date } })}
              />
            </View>
            {decideLater ? null : sameAsPickup ? (
              <LocationSummaryCard info={pickupInfo} onEdit={() => setSameAsPickup(false)} />
            ) : (
              <LocationSelector
                placeholder="Choose a delivery spot"
                errors={locationErrors("delivery")}
                registerField={(f, node) => registerField(`delivery.${f}`)(node)}
                value={deliveryInfo}
                selectedType="delivery"
                points={points}
                onSelectLocation={(val) =>
                  updateReservation({ deliveryInfo: { ...deliveryInfo, decideLater: false, ...val } })
                }
              />
            )}
          </Section>
        </View>
      </ScrollView>

      <PriceBar
        amount={money(total)}
        caption={pickupInfo?.date ? `Pickup ${pickupInfo.date}` : "Choose a pickup day"}
        action={<Button title="Continue" onPress={proceed} style={{ paddingHorizontal: space.xl }} />}
      />
      </KeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", gap: space.md, padding: space.xl },
});
