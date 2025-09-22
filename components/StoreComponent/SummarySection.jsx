import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SummarySection = ({ summary }) => {
  const { status, totalPrice } = summary;
  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      case 'completed': return '#17a2b8';
      default: return '#666';
    }
  };

  const getStatusBackgroundColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return '#d4edda';
      case 'pending': return '#fff3cd';
      case 'cancelled': return '#f8d7da';
      case 'completed': return '#d1ecf1';
      default: return '#f8f9fa';
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Booking Summary</Text>
      
      <View style={styles.summaryGrid}>
        <View style={[
          styles.statusCard,
          { backgroundColor: getStatusBackgroundColor(status) }
        ]}>
          <Text style={styles.label}>Status</Text>
          <Text style={[
            styles.statusValue,
            { color: getStatusColor(status) }
          ]}>
            {status?.toUpperCase() || 'UNKNOWN'}
          </Text>
        </View>
        
        <View style={styles.priceCard}>
          <Text style={styles.label}>Total Amount</Text>
          <Text style={styles.priceValue}>₵{totalPrice}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },
  summaryGrid: {
    gap: 12,
  },
  statusCard: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  priceCard: {
    backgroundColor: "#e8f5e8",
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: "#28a745",
  },
  label: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#28a745",
  },
});

export default SummarySection;