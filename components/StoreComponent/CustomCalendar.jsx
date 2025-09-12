import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CustomCalendar = ({ 
  startDate, 
  endDate, 
  selectedDate, 
  onDateSelect, 
  disabledDates = [],
  title = "Select Date"
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(startDate));

  // --- FIX: Define this function BEFORE using it ---
const generateMonthData = (monthStart, rangeStart, rangeEnd, disabled) => {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
  const days = [];
  
  // Fill empty slots before the first day
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];
    
    const isInRange = date >= rangeStart && date <= rangeEnd;
    const isDisabled = disabled.includes(dateString);
    const isToday = dateString === new Date().toISOString().split('T')[0];
    const isSelected = dateString === selectedDate;
    
    days.push({
      day,
      date: dateString,
      isInRange,
      isDisabled,
      isToday,
      isSelected,
      fullDate: date
    });
  }

  // ✅ Pad after the last day so the last week has 7 days
  while (days.length % 7 !== 0) {
    days.push(null);
  }
  
  return {
    month: monthStart.toLocaleString('default', { month: 'long', year: 'numeric' }),
    days,
    monthIndex: month,
    year
  };
};


  // Now safe to call generateMonthData here ✅
  const calendarData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [];

    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 1);

    while (current <= lastMonth) {
      const monthData = generateMonthData(current, start, end, disabledDates);
      months.push(monthData);
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }, [startDate, endDate, disabledDates, selectedDate]);

  const currentMonthData = calendarData.find(m => 
    m.monthIndex === currentMonth.getMonth() && m.year === currentMonth.getFullYear()
  ) || calendarData[0];

  const canGoPrevious = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return calendarData.some(m => m.monthIndex === prevMonth.getMonth() && m.year === prevMonth.getFullYear());
  };

  const canGoNext = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    return calendarData.some(m => m.monthIndex === nextMonth.getMonth() && m.year === nextMonth.getFullYear());
  };

  const goToPreviousMonth = () => {
    if (canGoPrevious()) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    }
  };

  const goToNextMonth = () => {
    if (canGoNext()) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    }
  };

  const handleDatePress = (dayData) => {
    if (dayData.isInRange && !dayData.isDisabled) {
      onDateSelect(dayData.date);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.calendarCard}>
        {/* Month Navigation */}
        <View style={styles.monthHeader}>
          <TouchableOpacity 
            style={[styles.navButton, !canGoPrevious() && styles.navButtonDisabled]}
            onPress={goToPreviousMonth}
            disabled={!canGoPrevious()}
          >
            <MaterialIcons 
              name="chevron-left" 
              size={24} 
              color={canGoPrevious() ? "#4A6FA5" : "#CBD5E1"} 
            />
          </TouchableOpacity>
          
          <Text style={styles.monthTitle}>{currentMonthData.month}</Text>
          
          <TouchableOpacity 
            style={[styles.navButton, !canGoNext() && styles.navButtonDisabled]}
            onPress={goToNextMonth}
            disabled={!canGoNext()}
          >
            <MaterialIcons 
              name="chevron-right" 
              size={24} 
              color={canGoNext() ? "#4A6FA5" : "#CBD5E1"} 
            />
          </TouchableOpacity>
        </View>

        {/* Day Labels */}
        <View style={styles.dayLabelsRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Text key={day} style={styles.dayLabel}>{day}</Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {Array.from({ length: Math.ceil(currentMonthData.days.length / 7) }, (_, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {currentMonthData.days.slice(weekIndex * 7, weekIndex * 7 + 7).map((dayData, dayIndex) => (
                <View key={dayIndex} style={styles.dayCell}>
                  {dayData ? (
                    <TouchableOpacity
                      style={[
                        styles.dayButton,
                        dayData.isSelected && styles.dayButtonSelected,
                        dayData.isToday && !dayData.isSelected && styles.dayButtonToday,
                        (!dayData.isInRange || dayData.isDisabled) && styles.dayButtonDisabled
                      ]}
                      onPress={() => handleDatePress(dayData)}
                      disabled={!dayData.isInRange || dayData.isDisabled}
                    >
                      <Text style={[
                        styles.dayText,
                        dayData.isSelected && styles.dayTextSelected,
                        dayData.isToday && !dayData.isSelected && styles.dayTextToday,
                        (!dayData.isInRange || dayData.isDisabled) && styles.dayTextDisabled
                      ]}>
                        {dayData.day}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.dayButton} />
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Selected Date Display */}
        {selectedDate && (
          <View style={styles.selectedDateContainer}>
            <MaterialIcons name="event" size={20} color="#4A6FA5" />
            <Text style={styles.selectedDateText}>
              Selected: {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
        )}
      </View>
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
  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  navButtonDisabled: {
    backgroundColor: "#F9FAFB",
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: -0.3,
  },
  dayLabelsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    paddingVertical: 8,
    letterSpacing: -0.1,
  },
  calendarGrid: {
    marginBottom: 16,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
  },
  dayButtonSelected: {
    backgroundColor: "#4A6FA5",
    shadowColor: "#4A6FA5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dayButtonToday: {
    backgroundColor: "#FEF3C7",
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  dayButtonDisabled: {
    backgroundColor: "transparent",
  },
  dayText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  dayTextToday: {
    color: "#92400E",
    fontWeight: "700",
  },
  dayTextDisabled: {
    color: "#CBD5E1",
  },
  selectedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF4FF",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E40AF",
    marginLeft: 8,
    letterSpacing: -0.1,
  },
});

export default CustomCalendar;
