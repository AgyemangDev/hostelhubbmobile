import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getStatusMeta } from '../../utils/bookingStatus';

const BookingHeader = ({ bookingReference, summary }) => {
  const { status, totalPrice } = summary;
  const statusMeta = getStatusMeta(status);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Storage Booking Details</Text>
      
      <View style={styles.referenceContainer}>
        <Text style={styles.label}>Booking Reference</Text>
        <Text style={styles.reference}>#{bookingReference}</Text>
      </View>

      {/* ---------- SUMMARY SECTION ---------- */}
      <View style={styles.summaryGrid}>
        <View style={[
          styles.statusCard,
          { 
            backgroundColor: statusMeta.bg,
            borderColor: statusMeta.border,
          }
        ]}>
          <MaterialCommunityIcons 
            name={statusMeta.icon} 
            size={24} 
            color={statusMeta.color}
            style={styles.statusIcon}
          />
          <Text style={styles.summaryLabel}>Status</Text>
          <Text style={[
            styles.statusValue,
            { color: statusMeta.color }
          ]}>
            {statusMeta.label}
          </Text>
        </View>
        
        <View style={styles.priceCard}>
          <MaterialCommunityIcons 
            name="currency-usd" 
            size={24} 
            color="#047857"
            style={styles.statusIcon}
          />
          <Text style={styles.summaryLabel}>Total Amount</Text>
          <Text style={styles.priceValue}>₵{Number(totalPrice).toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
    color: "#007AFF",
    textAlign: "center",
  },
  referenceContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  reference: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "700",
    marginTop: 4,
    fontFamily: "monospace",
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statusCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  priceCard: {
    flex: 1,
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#BBF7D0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusIcon: {
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#047857",
  },
});

export default BookingHeader;