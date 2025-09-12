import React, { useState } from "react";

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
import COLORS from "../../constants/Colors";
const RenderReservationDetailsStep = ({
  formData,
  setFormData,
  nextStep,
  prevStep,
}) => {
  const pickupDates = ["2025-04-24", "2025-04-25"];
  const deliveryDates = ["2025-05-24", "2025-05-25"];
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
  const formatDateInline = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const dayOfWeekShort = date.toLocaleString("default", { weekday: "short" });
    return `${dayOfWeekShort}. ${day} ${month} ${year}`;
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
            <MaterialIcons name="event" size={24} color="#4A6FA5" />
            <Text style={styles.cardTitle}>Pick-Up Information</Text>
          </View>
          <Text style={styles.inputLabel}>
            Select Pick-Up Date <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.dateOptionsRow}>
            {pickupDates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateOptionButton,
                  formData.pickupDate === date && styles.selectedDateOption,
                ]}
                onPress={() => handleDateSelect("pickupDate", date)}
              >
                <Text
                  style={
                    formData.pickupDate === date
                      ? styles.selectedDateText
                      : styles.dateText
                  }
                >
                  {formatDateInline(date)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.inputLabel}>
            Pick-Up Location <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View
            style={[
              styles.inputContainer,

              !formData.pickupLocation && styles.inputContainerError,
            ]}
          >
            <MaterialIcons
              name="location-on"
              size={22}
              color={!formData.pickupLocation ? "#E53E3E" : "#999"}
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.textInput}
              placeholder="Republic Hall, Chapel Lane, Room 132M"
              placeholderTextColor="#aaa"
              value={formData.pickupLocation || ""}
              onChangeText={(text) =>
                handleLocationChange("pickupLocation", text)
              }
            />
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="local-shipping" size={24} color="#4A6FA5" />

            <Text style={styles.cardTitle}>Delivery Information</Text>
          </View>

          <Text style={styles.inputLabel}>
            Select Delivery Date <Text style={styles.requiredStar}>*</Text>
          </Text>

          <View style={styles.dateOptionsRow}>
            {deliveryDates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateOptionButton,

                  formData.deliveryDate === date && styles.selectedDateOption,
                ]}
                onPress={() => handleDateSelect("deliveryDate", date)}
              >
                <Text
                  style={
                    formData.deliveryDate === date
                      ? styles.selectedDateText
                      : styles.dateText
                  }
                >
                  {formatDateInline(date)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>
            Delivery Location <Text style={styles.requiredStar}>*</Text>
          </Text>

          <View
            style={[
              styles.inputContainer,

              !formData.deliveryLocation && styles.inputContainerError,
            ]}
          >
            <MaterialIcons
              name="location-on"
              size={22}
              color={!formData.deliveryLocation ? "#E53E3E" : "#999"}
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.textInput}
              placeholder="Africa Hall Room 342s"
              placeholderTextColor="#aaa"
              value={formData.deliveryLocation || ""}
              onChangeText={(text) =>
                handleLocationChange("deliveryLocation", text)
              }
            />
          </View>

          <TouchableOpacity
            style={styles.usePickupButton}
            onPress={handleUsePickupLocation}
          >
            <MaterialIcons
              name={usePickupLocation ? "check-box" : "check-box-outline-blank"}
              size={20}
              color="#4A6FA5"
              style={{ marginRight: 5 }}
            />

            <Text style={styles.usePickupText}>Use Pick-Up Location</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  formSection: {
    paddingBottom: 150,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2D3748",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4A6FA5",
    marginLeft: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#4A5568",
  },
  requiredStar: {
    color: "#E53E3E",
    fontWeight: "bold",
  },
  dateOptionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateOptionButton: {
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F9FAFC",
    justifyContent: "center",
  },
  selectedDateOption: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.background,
  },
  dateText: {
    fontSize: 16,
    color: "#2D3748",
    textAlign: "center",
  },
  selectedDateText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFC",
    marginBottom: 10,
  },
  inputContainerError: {
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#4A5568",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#A0AEC0",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
  },
  usePickupButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  usePickupText: {
    fontSize: 16,
    color: "#4A6FA5",
  },
  keyboardSpace: {
    height: 50,
  },
});
