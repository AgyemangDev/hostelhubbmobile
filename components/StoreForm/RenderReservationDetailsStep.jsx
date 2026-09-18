import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BackButton, ContinueButton } from "./NavigationButton";

const TEAL = "#0D9488";
const TEAL_LIGHT = "#E1F5EE";

// The previous version offered exactly two hardcoded dates ("2025-04-24"/
// "2025-04-25" for pickup, "2025-05-24"/"2025-05-25" for delivery) — by now
// both are in the past, so neither option was ever selectable. Generating a
// rolling window from today fixes that permanently instead of needing
// another manual date update later. Pickup opens tomorrow; delivery opens a
// week after pickup starts, giving a reasonable minimum storage window.
const generateUpcomingDates = (count, startOffsetDays) => {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + startOffsetDays + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
};

const formatDateChip = (dateString) => {
  const date = new Date(dateString);
  return {
    day: date.getDate(),
    weekday: date.toLocaleString("default", { weekday: "short" }),
    month: date.toLocaleString("default", { month: "short" }),
  };
};

const DateChipRow = ({ dates, selectedDate, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.dateScroll}
    contentContainerStyle={styles.dateScrollContent}
  >
    {dates.map((date) => {
      const { day, weekday, month } = formatDateChip(date);
      const isSelected = selectedDate === date;
      return (
        <TouchableOpacity
          key={date}
          style={[styles.dateChip, isSelected && styles.dateChipSelected]}
          onPress={() => onSelect(date)}
          activeOpacity={0.8}
        >
          <Text style={[styles.dateChipWeekday, isSelected && styles.dateChipTextSelected]}>
            {weekday}
          </Text>
          <Text style={[styles.dateChipDay, isSelected && styles.dateChipTextSelected]}>
            {day}
          </Text>
          <Text style={[styles.dateChipMonth, isSelected && styles.dateChipTextSelected]}>
            {month}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const LocationInput = ({ value, onChangeText, placeholder, hasError }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.inputContainer,
        focused && styles.inputContainerFocused,
        hasError && !focused && styles.inputContainerError,
      ]}
    >
      <MaterialIcons
        name="location-on"
        size={20}
        color={focused ? TEAL : hasError ? "#E53E3E" : "#9CA3AF"}
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="#A0AEC0"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
};

const RenderReservationDetailsStep = ({ formData, setFormData, nextStep, prevStep }) => {
  const pickupDates = useMemo(() => generateUpcomingDates(10, 1), []);
  const deliveryDates = useMemo(() => generateUpcomingDates(10, 8), []);
  const [usePickupLocation, setUsePickupLocation] = useState(false);

  const handleDateSelect = (type, date) => {
    setFormData({ ...formData, [type]: date });
  };

  const handleLocationChange = (type, location) => {
    setFormData({ ...formData, [type]: location });
  };

  const handleNext = () => {
    if (!formData.pickupDate || !formData.deliveryDate) {
      Alert.alert(
        "Date Selection Required",
        "Please select both a pick-up date and a delivery date to continue."
      );
      return;
    }
    if (!formData.pickupLocation || !formData.deliveryLocation) {
      Alert.alert(
        "Location Required",
        "Please provide both pick-up and delivery locations to continue."
      );
      return;
    }
    nextStep();
  };

  const handleUsePickupLocation = () => {
    setUsePickupLocation(!usePickupLocation);
    if (!usePickupLocation && formData.pickupLocation) {
      setFormData({ ...formData, deliveryLocation: formData.pickupLocation });
    } else {
      setFormData({ ...formData, deliveryLocation: "" });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={styles.formSection}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.sectionTitle}>Reservation Details</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrap}>
              <MaterialIcons name="event" size={20} color={TEAL} />
            </View>
            <Text style={styles.cardTitle}>Pick-Up Information</Text>
          </View>

          <Text style={styles.inputLabel}>
            Select pick-up date <Text style={styles.requiredStar}>*</Text>
          </Text>
          <DateChipRow
            dates={pickupDates}
            selectedDate={formData.pickupDate}
            onSelect={(d) => handleDateSelect("pickupDate", d)}
          />

          <Text style={styles.inputLabel}>
            Pick-up location <Text style={styles.requiredStar}>*</Text>
          </Text>
          <LocationInput
            value={formData.pickupLocation || ""}
            onChangeText={(t) => handleLocationChange("pickupLocation", t)}
            placeholder="e.g. Republic Hall, Chapel Lane, Room 132M"
            hasError={!formData.pickupLocation}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrap}>
              <MaterialIcons name="local-shipping" size={20} color={TEAL} />
            </View>
            <Text style={styles.cardTitle}>Delivery Information</Text>
          </View>

          <Text style={styles.inputLabel}>
            Select delivery date <Text style={styles.requiredStar}>*</Text>
          </Text>
          <DateChipRow
            dates={deliveryDates}
            selectedDate={formData.deliveryDate}
            onSelect={(d) => handleDateSelect("deliveryDate", d)}
          />

          <Text style={styles.inputLabel}>
            Delivery location <Text style={styles.requiredStar}>*</Text>
          </Text>
          <LocationInput
            value={formData.deliveryLocation || ""}
            onChangeText={(t) => handleLocationChange("deliveryLocation", t)}
            placeholder="e.g. Africa Hall, Room 342S"
            hasError={!formData.deliveryLocation}
          />

          <TouchableOpacity
            style={styles.usePickupButton}
            onPress={handleUsePickupLocation}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={usePickupLocation ? "check-box" : "check-box-outline-blank"}
              size={20}
              color={TEAL}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.usePickupText}>Same as pick-up location</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsContainer}>
          <BackButton onPress={prevStep} />
          <ContinueButton onPress={handleNext} />
        </View>
        <View style={styles.keyboardSpace} />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default RenderReservationDetailsStep;

const styles = StyleSheet.create({
  formSection: {
    paddingBottom: 150,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#F0FDFA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  cardIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: TEAL_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 4,
    color: "#4A5568",
  },
  requiredStar: {
    color: "#E53E3E",
    fontWeight: "bold",
  },

  dateScroll: {
    marginBottom: 18,
  },
  dateScrollContent: {
    gap: 8,
    paddingRight: 8,
  },
  dateChip: {
    width: 58,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#F8FFFE",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dateChipSelected: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  dateChipWeekday: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  dateChipDay: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "700",
    marginVertical: 2,
  },
  dateChipMonth: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  dateChipTextSelected: {
    color: "#fff",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFC",
    marginBottom: 6,
  },
  inputContainerFocused: {
    borderColor: TEAL,
    backgroundColor: "#fff",
  },
  inputContainerError: {
    borderColor: "#FCA5A5",
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1F2937",
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 10,
  },
  usePickupButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  usePickupText: {
    fontSize: 14,
    color: TEAL,
    fontWeight: "500",
  },
  keyboardSpace: {
    height: 50,
  },
});
