"use client";
import React, { useState } from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import COLORS from "../../constants/Colors";
import FloatingLabelInput from "../InputFields/FormInput";
import { Calendar } from "react-native-calendars";

export default function DateSelector({
  label,
  placeholder,
  value,
  minDate,
  maxDate,
  onChange,
}) {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSelectDate = (date) => {
    onChange(date.dateString);
  };

  return (
    <View style={styles.wrapper}>
      {/* Wrap the entire input in a Pressable */}
      <Pressable 
        onPress={() => setShowCalendar(true)}
        style={{ width: '100%' }}
      >
        <View pointerEvents="none">
          <FloatingLabelInput
            placeholder={placeholder}
            value={value || ""}
            onChangeText={() => {}}
            disabled={true}
          />
        </View>
      </Pressable>

      {/* Calendar overlay */}
      <Modal visible={showCalendar} transparent animationType="fade">
        <Pressable
          style={styles.overlay}
          onPress={() => setShowCalendar(false)}
        >
          <Pressable style={styles.calendarContainer}>
            <Calendar
              current={minDate?.toISOString().split("T")[0]} // Show the month of minDate
              minDate={minDate?.toISOString().split("T")[0]}
              maxDate={maxDate?.toISOString().split("T")[0]}
              onDayPress={handleSelectDate}
              hideExtraDays={true}
              disableMonthChange={true} // Prevent month navigation
              hideArrows={true} // Hide navigation arrows
              markedDates={
                value
                  ? {
                      [value]: { selected: true, selectedColor: COLORS.primary },
                    }
                  : {}
              }
              theme={{
                todayTextColor: COLORS.primary,
                selectedDayBackgroundColor: COLORS.primary,
                arrowColor: COLORS.primary,
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 0,
  },
  label: {
    marginBottom: 6,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    minWidth: 320,
    maxWidth: "90%",
  },
});