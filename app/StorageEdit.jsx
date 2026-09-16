"use client";
import React, { useContext, useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UserContext } from "../context/UserContext";
import LocationSelector from "../components/Storage/LocationSelector";
import BottomButton from "../components/ButtonComponents/BottomButton";
import COLORS from "../constants/Colors";
import API_BASE_URL from "../utils/api/api";

// items/pickup_info/delivery_info come straight out of the DB row and may
// already be objects (from context) or JSON strings (passed through params).
const safeParse = (value, fallback) => {
  if (value == null) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const StorageEdit = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { booking } = useLocalSearchParams();

  const parsedBooking = useMemo(() => {
    if (!booking) return null;
    const raw = typeof booking === "string" ? JSON.parse(booking) : booking;
    return {
      ...raw,
      delivery_info: safeParse(raw.delivery_info, {}),
    };
  }, [booking]);

  const [location, setLocation] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!parsedBooking) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Booking data not found.</Text>
          <Text style={styles.errorSubtext}>
            Please go back and try again from your bookings list.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // The endpoint only allows filling in a location that was left unset (the
  // "decide later" path) — once one is on file, changing it needs support.
  const alreadySet = !!(
    parsedBooking.delivery_info?.area || parsedBooking.delivery_info?.hostel
  );
  const isDelivered =
    parsedBooking.delivery_status === "completed" ||
    parsedBooking.delivery_status === "delivered";

  const handleSave = async () => {
    if (!location?.area) {
      Alert.alert("Missing information", "Please select a delivery location.");
      return;
    }
    if (
      location.area === "Off Campus" &&
      (!location.offCampusArea || !location.hostel?.trim())
    ) {
      Alert.alert(
        "Missing information",
        "Please select an off-campus area and enter the hostel name."
      );
      return;
    }
    if (!location.room?.trim()) {
      Alert.alert("Missing information", "Please enter a room number.");
      return;
    }

    setSaving(true);
    try {
      const token = await user.getIdToken(false);
      const res = await fetch(
        `${API_BASE_URL}/bookings/storage/delivery-location/${parsedBooking.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(location),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update delivery location");
      }

      Alert.alert("Saved", "Your delivery location has been updated.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert("Something went wrong", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Delivery location</Text>
          <Text style={styles.subtitle}>
            #{String(parsedBooking.bookingReference ?? parsedBooking.id ?? "").slice(0, 13)}
          </Text>
        </View>

        {isDelivered ? (
          <View style={styles.noticeCard}>
            <Text style={styles.noticeText}>
              This order has already been delivered — the delivery location can no longer
              be changed.
            </Text>
          </View>
        ) : alreadySet ? (
          <View style={styles.noticeCard}>
            <Text style={styles.noticeText}>
              A delivery location is already set for this booking. Contact customer
              service if you need to change it.
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <LocationSelector
              placeholder="Select delivery location"
              value={location}
              selectedType="delivery"
              onSelectLocation={setLocation}
            />
          </View>
        )}
      </ScrollView>

      {!alreadySet && !isDelivered && (
        <View style={styles.footer}>
          <BottomButton
            buttonText={saving ? "Saving…" : "Save"}
            onPressFunction={handleSave}
            disabled={saving}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  container: {
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
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: "monospace",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  noticeCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  noticeText: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default StorageEdit;
