import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import COLORS from "../../constants/Colors";

const DateSelector = ({ label, dates, selectedDate, onSelect }) => {
  const formatDateInline = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Text style={styles.label}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.dateRow}>
        {dates.map((date) => (
          <TouchableOpacity
            key={date}
            style={[
              styles.dateButton,
              selectedDate === date && styles.selectedButton,
            ]}
            onPress={() => onSelect(date)}
          >
            <Text style={selectedDate === date ? styles.selectedText : styles.dateText}>
              {formatDateInline(date)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default DateSelector;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#4A5568",
  },
  required: {
    color: "#E53E3E",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.background,
  },
  dateText: {
    color: "#2D3748",
    fontSize: 15,
  },
  selectedText: {
    color: "#fff",
    fontSize: 15,
  },
});
