import React from 'react';
import { View, Text, StyleSheet, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';

const AccountInfo = ({ hostelData, adminData, bookingData, transactionFee }) => {
  const handleCall = () => {
    const phoneNumber = `tel:${adminData.phone}`;
    Linking.openURL(phoneNumber);
  };

  const originalPrice = parseFloat(bookingData.selectedPayment) || 0;
  const parsedTransactionFee = parseFloat(transactionFee) || 0;

  const hostelPriceWithServiceFee = originalPrice * 1.05;
  const totalAmount = hostelPriceWithServiceFee + parsedTransactionFee;

  return (
    <View style={styles.container}>
      {/* Hostel Image & Info */}
      <View style={styles.hostelCard}>
        <Image source={{ uri: hostelData.frontImage }} style={styles.hostelImage} />
        <View style={styles.hostelInfo}>
          <Text style={styles.hostelName}>{hostelData.hostelName}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.hostelLocation}>{hostelData.location}</Text>
          </View>
        </View>
      </View>

      {/* Manager Info */}
      <View style={styles.infoRow}>
        <Text style={styles.label}>Manager's Name</Text>
        <Text style={styles.value}>{adminData.firstname} {adminData.surname}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{adminData.email}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Payment Info */}
      <View style={styles.infoRow}>
        <Text style={styles.label}>Hostel Price</Text>
        <Text style={styles.value}>GHS {hostelPriceWithServiceFee.toFixed(2)}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Transaction Fee</Text>
        <Text style={styles.value}>GHS {parsedTransactionFee.toFixed(2)}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Total */}
      <View style={styles.infoRow}>
        <Text style={styles.totalLabel}>Total to Pay</Text>
        <Text style={styles.totalValue}>GHS {totalAmount.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 8,
    borderColor: '#e0e0e0',
  },
  hostelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginBottom: 15,
  },
  hostelImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  hostelInfo: {
    flex: 1,
  },
  hostelName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostelLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.background,
  },
});

export default AccountInfo;
