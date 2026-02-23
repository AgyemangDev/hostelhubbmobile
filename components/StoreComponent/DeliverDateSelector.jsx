import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DeliveryDateSelector = ({ selectedDate, onDateSelect, title = "Select Delivery Date" }) => {
  // Determine next year's January 10th (Saturday in your requirement)
  const defaultStartDate = useMemo(() => {
    const now = new Date();
    const nextYear = now.getMonth() > 0 ? now.getFullYear() + 1 : now.getFullYear();
    return new Date(`${nextYear}-01-10`);
  }, []);

  // Generate delivery options for 7 days starting from defaultStartDate
  const deliveryOptions = useMemo(() => {
    const options = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(defaultStartDate);
      date.setDate(defaultStartDate.getDate() + i);

      const dateString = date.toISOString().split('T')[0];
      const dayName = dayNames[date.getDay()];
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const dayNumber = date.getDate();

      let description = '';
      if (i === 0) description = 'Assumed School reopening day';
      else if (i === 1) description = 'Assumed Second day after reopening';
      else if (i === 2) description = 'Third day after reopening';
      else if (i <= 6) description = 'First week settling in';
      else description = 'Weekend';

      options.push({
        date: dateString,
        dayName,
        monthName,
        dayNumber,
        description,
        fullDate: date,
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }

    return options;
  }, [defaultStartDate]);

  const handleDateSelect = (option) => {
    onDateSelect(option.date);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Info box with change notice */}
      <View style={styles.infoBox}>
        <MaterialIcons name="info-outline" size={18} color="#4A6FA5" />
        <Text style={styles.infoText}>
          Deliveries are planned to start from Saturday, {defaultStartDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. 
          If the school's reopening date changes, we’ll notify you and adjust your delivery date according to your preference.
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {deliveryOptions.map((option, index) => (
          <TouchableOpacity
            key={option.date}
            style={[
              styles.optionCard,
              selectedDate === option.date && styles.optionCardSelected,
              option.isWeekend && styles.optionCardWeekend
            ]}
            onPress={() => handleDateSelect(option)}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              {/* Date Circle */}
              <View style={[
                styles.dateCircle,
                selectedDate === option.date && styles.dateCircleSelected,
                option.isWeekend && styles.dateCircleWeekend
              ]}>
                <Text style={[
                  styles.dayNumber,
                  selectedDate === option.date && styles.dayNumberSelected
                ]}>
                  {option.dayNumber}
                </Text>
                <Text style={[
                  styles.monthText,
                  selectedDate === option.date && styles.monthTextSelected
                ]}>
                  {option.monthName}
                </Text>
              </View>

              {/* Day Info */}
              <View style={styles.dayInfo}>
                <Text style={[
                  styles.dayName,
                  selectedDate === option.date && styles.dayNameSelected
                ]}>
                  {option.dayName}
                </Text>
              
                {option.isWeekend && (
                  <View style={styles.weekendBadge}>
                    <Text style={styles.weekendBadgeText}>Weekend</Text>
                  </View>
                )}
              </View>

              {/* Selection Indicator */}
              <View style={[
                styles.selectionIndicator,
                selectedDate === option.date && styles.selectionIndicatorSelected
              ]}>
                {selectedDate === option.date && (
                  <MaterialIcons name="check" size={20} color="#FFFFFF" />
                )}
              </View>
            </View>

            {/* Progress indicator */}
            <View style={styles.progressContainer}>
              <View style={[
                styles.progressDot,
                index === 0 && styles.progressDotFirst,
                selectedDate === option.date && styles.progressDotSelected
              ]} />
              {index < deliveryOptions.length - 1 && (
                <View style={[
                  styles.progressLine,
                  deliveryOptions.findIndex(opt => opt.date === selectedDate) > index && styles.progressLineActive
                ]} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected Date Summary */}
      {selectedDate && (
        <View style={styles.selectedSummary}>
          <MaterialIcons name="local-shipping" size={20} color="#4A6FA5" />
          <Text style={styles.selectedSummaryText}>
            Delivery scheduled for {
              deliveryOptions.find(opt => opt.date === selectedDate)?.fullDate
                .toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })
            }
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EBF4FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#4A6FA5",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoText: {
    fontSize: 14,
    color: "#1E40AF",
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
    fontWeight: "500",
    letterSpacing: -0.1,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  optionCardSelected: {
    backgroundColor: "#EBF4FF",
    borderColor: "#4A6FA5",
    shadowColor: "#4A6FA5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  optionCardWeekend: {
    borderColor: "#F59E0B",
    backgroundColor: "#FFFBEB",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  dateCircleSelected: {
    backgroundColor: "#4A6FA5",
    borderColor: "#4A6FA5",
    shadowColor: "#4A6FA5",
    shadowOpacity: 0.3,
  },
  dateCircleWeekend: {
    borderColor: "#F59E0B",
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    lineHeight: 22,
  },
  dayNumberSelected: {
    color: "#FFFFFF",
  },
  monthText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  monthTextSelected: {
    color: "#E0E7FF",
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  dayNameSelected: {
    color: "#4A6FA5",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 6,
  },
  descriptionSelected: {
    color: "#1E40AF",
  },
  weekendBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  weekendBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#92400E",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectionIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  selectionIndicatorSelected: {
    backgroundColor: "#4A6FA5",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
  },
  progressDotFirst: {
    backgroundColor: "#10B981",
  },
  progressDotSelected: {
    backgroundColor: "#4A6FA5",
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 4,
  },
  progressLineActive: {
    backgroundColor: "#4A6FA5",
  },
  selectedSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  selectedSummaryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#166534",
    marginLeft: 8,
    flex: 1,
    letterSpacing: -0.1,
  },
});

export default DeliveryDateSelector;