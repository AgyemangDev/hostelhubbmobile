import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { formatDate } from '../../utils/dateUtils';

const { width } = Dimensions.get('window');
const GAP = 8; // gap between cards
const CARD_WIDTH = (width - 14*2 - GAP) / 2; // section padding 14 each side + gap

const DatesSection = ({ dates }) => {
  const { bookingDate, pickupDate, deliveryDate } = dates;

  const dateItems = [
    { label: "Booking Date", value: formatDate(bookingDate) },
    { label: "Pickup Date", value: formatDate(pickupDate) },
    { label: "Delivery Date", value: formatDate(deliveryDate) },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Important Dates</Text>
      <View style={styles.cardsContainer}>
        {dateItems.map((item, index) => (
          <View key={index} style={styles.dateCard}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
        {/* Fill the second card of last row if items are odd */}
        {dateItems.length % 2 !== 0 && <View style={[styles.dateCard, { opacity: 0 }]} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 6,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dateCard: {
    width: CARD_WIDTH -20,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
    marginBottom: GAP,
  },
  label: {
    fontSize: 11,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "600",
  },
});

export default DatesSection;
