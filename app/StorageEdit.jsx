"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UserContext } from "../context/UserContext";
import LocationSelector from "../components/Storage/LocationSelector";
import DateSelector from "../components/Storage/DateSelector";
import BottomButton from "../components/ButtonComponents/BottomButton";
import COLORS from "../constants/Colors";
import API_BASE_URL from "../utils/api/api";
import { useBookingsContext } from "../context/BookingsContext";

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

// Delivery days close at 07:00 (Ghana = UTC) that morning; users can move the
// date up to a week after the school's first delivery day.
const CUTOFF_HOUR_UTC = 7;
const MAX_DAYS_AFTER_FIRST_DELIVERY = 7;
const DAY_MS = 24 * 3600 * 1000;
const toDateStr = (ms) => new Date(ms).toISOString().slice(0, 10);
const dayStartMs = (dateStr) => new Date(`${dateStr}T00:00:00Z`).getTime();
const cutoffPassed = (dateStr) =>
  Date.now() >= dayStartMs(dateStr) + CUTOFF_HOUR_UTC * 3600 * 1000;

const formatDay = (dateStr) =>
  dateStr
    ? new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        timeZone: "UTC",
      })
    : "";

const StorageEdit = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { refetch } = useBookingsContext();
  const { booking } = useLocalSearchParams();

  const parsedBooking = useMemo(() => {
    if (!booking) return null;
    const raw = typeof booking === "string" ? JSON.parse(booking) : booking;
    return {
      ...raw,
      delivery_info: safeParse(raw.delivery_info, {}),
    };
  }, [booking]);

  const existingLocation = useMemo(() => {
    const info = parsedBooking?.delivery_info;
    if (!info?.area) return null;
    return {
      area: info.area,
      offCampusArea: info.offCampusArea || null,
      hostel: info.hostel || null,
      room: info.room || "",
    };
  }, [parsedBooking]);

  const [location, setLocation] = useState(existingLocation);
  const [saving, setSaving] = useState(false);
  const [points, setPoints] = useState([]);
  const [pointsLoading, setPointsLoading] = useState(true);
  const [pointsError, setPointsError] = useState(null);
  const [firstDeliveryDate, setFirstDeliveryDate] = useState(null);
  const [lastDeliveryDate, setLastDeliveryDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [newDate, setNewDate] = useState(null);

  useEffect(() => {
    const d = parsedBooking?.delivery_info?.date || parsedBooking?.delivery_date;
    const normalized = d ? String(d).slice(0, 10) : null;
    setCurrentDate(normalized);
    setNewDate(normalized);
  }, [parsedBooking]);

  // The booking's delivery pickup points depend on which school it was
  // booked under (KNUST, UG, etc.) — fetch that school's points the same
  // way the original booking flow does, using the booking's own school_id
  // instead of a live reservation context.
  useEffect(() => {
    let isMounted = true;

    const loadPoints = async () => {
      if (!parsedBooking?.school_id) {
        if (isMounted) setPointsLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/storage-schools/public`);
        if (!res.ok) throw new Error("Failed to load location options");

        const { schools = [] } = await res.json();
        const school = schools.find((s) => s.id === parsedBooking.school_id);
        if (!isMounted) return;

        if (school?.schedule?.delivery_start_date) {
          setFirstDeliveryDate(school.schedule.delivery_start_date);
          setLastDeliveryDate(school.schedule.delivery_end_date);
        }

        if (!school) {
          setPointsError("Could not load pickup/delivery points for this booking's school.");
        } else {
          setPoints(school.points || []);
        }
      } catch (err) {
        console.error("Failed to load storage school points:", err);
        if (isMounted) setPointsError("Could not load location options. Please try again.");
      } finally {
        if (isMounted) setPointsLoading(false);
      }
    };

    loadPoints();
    return () => {
      isMounted = false;
    };
  }, [parsedBooking?.school_id]);

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

  const isDelivered =
    parsedBooking.delivery_status === "completed" ||
    parsedBooking.delivery_status === "delivered";

  const dateLocked = !!currentDate && cutoffPassed(currentDate);
  const todayMs = dayStartMs(toDateStr(Date.now()));
  const earliestOpenMs = cutoffPassed(toDateStr(Date.now())) ? todayMs + DAY_MS : todayMs;
  const windowMinMs = firstDeliveryDate ? dayStartMs(firstDeliveryDate) : null;
  const dateMin = windowMinMs ? new Date(Math.max(windowMinMs, earliestOpenMs)) : null;
  const dateMax = windowMinMs
    ? new Date(windowMinMs + MAX_DAYS_AFTER_FIRST_DELIVERY * DAY_MS)
    : null;
  const canPickDate = !!dateMin && !!dateMax && dateMin <= dateMax;

  const dateUnchanged = !newDate || newDate === currentDate;
  const locationChanged =
    !!location?.area &&
    (location.area !== existingLocation?.area ||
      (location.offCampusArea || null) !== (existingLocation?.offCampusArea || null) ||
      (location.hostel || "").trim() !== (existingLocation?.hostel || "").trim() ||
      (location.room || "").trim() !== (existingLocation?.room || "").trim());
  const nothingToSave = dateUnchanged && !locationChanged;

  const authedPatch = async (path, body) => {
    const token = await user.getIdToken(false);
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save changes");
    return data;
  };

  const handleSave = async () => {
    if (locationChanged) {
      if (
        location.area === "Off Campus" &&
        (!location.offCampusArea || !location.hostel?.trim())
      ) {
        Alert.alert("Missing information", "Please select an off-campus area and enter the hostel name.");
        return;
      }
      if (!location.room?.trim()) {
        Alert.alert("Missing information", "Please enter a room number.");
        return;
      }
    }

    const lines = [];
    if (!dateUnchanged) lines.push(`Delivery date: ${formatDay(newDate)}`);
    if (locationChanged) {
      const place = [location.area, location.offCampusArea, location.hostel, location.room && `Room ${location.room}`]
        .filter(Boolean)
        .join(", ");
      lines.push(`Delivery location: ${place}`);
    }
    Alert.alert(
      "Confirm changes",
      `Are you sure you want to change your delivery details?\n\n${lines.join("\n")}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, save", onPress: performSave },
      ]
    );
  };

  const performSave = async () => {
    setSaving(true);
    try {
      if (!dateUnchanged) {
        await authedPatch(`/bookings/storage/delivery-date/${parsedBooking.id}`, { date: newDate });
        setCurrentDate(newDate);
      }
      if (locationChanged) {
        await authedPatch(`/bookings/storage/delivery-location/${parsedBooking.id}`, location);
      }
      // Refresh the shared bookings list so the card and details screen update immediately.
      await refetch();
      Alert.alert("Saved", "Your delivery details have been updated.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert("Something went wrong", err.message);
      refetch();
    } finally {
      setSaving(false);
    }
  };

  const bookingRef = String(parsedBooking.bookingReference ?? parsedBooking.id ?? "").slice(0, 13);

  const SectionHeader = ({ icon, title }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={18} color={COLORS.background} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Storage delivery</Text>
          <Text style={styles.title}>Manage your delivery</Text>
          <Text style={styles.subtitle}>Booking #{bookingRef}</Text>
        </View>

        {isDelivered ? (
          <View style={styles.noticeCard}>
            <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
            <Text style={styles.noticeText}>
              This order has already been delivered, so it can no longer be changed.
            </Text>
          </View>
        ) : (
          <>
            {firstDeliveryDate && lastDeliveryDate ? (
              <View style={styles.disclaimer}>
                <View style={styles.disclaimerHeader}>
                  <Ionicons name="information-circle" size={20} color={COLORS.background} />
                  <Text style={styles.disclaimerTitle}>Free delivery window</Text>
                </View>
                <Text style={styles.disclaimerText}>
                  HostelHubb's free delivery is on{" "}
                  <Text style={styles.disclaimerBold}>{formatDay(firstDeliveryDate)}</Text> to{" "}
                  <Text style={styles.disclaimerBold}>{formatDay(lastDeliveryDate)}</Text>.
                  Anything outside this window means you will be responsible for all related
                  costs, including the transportation fee and the person who delivers it, or
                  you can pick it up yourself. Thank you for your understanding.
                </Text>
              </View>
            ) : null}

            <View style={styles.card}>
              <SectionHeader icon="calendar-outline" title="Delivery date" />
              {currentDate ? (
                <Text style={styles.currentDate}>
                  Currently scheduled: <Text style={styles.disclaimerBold}>{formatDay(currentDate)}</Text>
                </Text>
              ) : null}
              {dateLocked ? (
                <Text style={styles.helperText}>
                  Your delivery day has started, so the date can no longer be changed.
                </Text>
              ) : pointsLoading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : canPickDate ? (
                <>
                  <Text style={styles.helperText}>
                    You can move your delivery up to a week after your school's first
                    delivery day. Once 7:00 AM has passed on a day, it can't be selected
                    again.
                  </Text>
                  <DateSelector
                    placeholder="Delivery date"
                    value={newDate}
                    minDate={dateMin}
                    maxDate={dateMax}
                    onChange={setNewDate}
                  />
                </>
              ) : (
                <Text style={styles.helperText}>
                  No later delivery dates are available to choose from.
                </Text>
              )}
            </View>

            <View style={styles.card}>
              <SectionHeader icon="location-outline" title="Delivery location" />
              {dateLocked ? (
                <Text style={styles.helperText}>
                  Your delivery day has started, so the delivery location can no longer be
                  changed.
                </Text>
              ) : pointsLoading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : pointsError ? (
                <Text style={styles.helperText}>{pointsError}</Text>
              ) : (
                <LocationSelector
                  placeholder="Select delivery location"
                  value={location}
                  selectedType="delivery"
                  onSelectLocation={setLocation}
                  points={points}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>

      {!isDelivered && !dateLocked && !pointsLoading && (
        <View style={styles.footer}>
          <BottomButton
            buttonText={saving ? "Saving…" : "Save changes"}
            onPressFunction={handleSave}
            disabled={saving || nothingToSave}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F8F7" },
  container: { padding: 20, paddingBottom: 120, gap: 16 },
  hero: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 20,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  title: { fontSize: 22, fontWeight: "700", color: COLORS.white, marginBottom: 4 },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.85)", fontFamily: "monospace" },
  disclaimer: {
    backgroundColor: "#E8F4F1",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#BFE0D8",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.background,
  },
  disclaimerHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  disclaimerTitle: { fontSize: 15, fontWeight: "700", color: COLORS.darkest },
  disclaimerText: { fontSize: 13.5, color: COLORS.textDark, lineHeight: 20 },
  disclaimerBold: { fontWeight: "700", color: COLORS.darkest },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E1ECE9",
    gap: 12,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F4F1",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: COLORS.textDark },
  currentDate: { fontSize: 14, color: COLORS.textMuted },
  helperText: { fontSize: 13.5, color: COLORS.textMuted, lineHeight: 20 },
  noticeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E1ECE9",
  },
  noticeText: { flex: 1, fontSize: 14, color: COLORS.textMuted, lineHeight: 20 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#E1ECE9",
    padding: 4,
  },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  errorText: { fontSize: 20, fontWeight: "600", color: "#dc3545", textAlign: "center", marginBottom: 8 },
  errorSubtext: { fontSize: 16, color: "#666", textAlign: "center", lineHeight: 24 },
});

export default StorageEdit;
