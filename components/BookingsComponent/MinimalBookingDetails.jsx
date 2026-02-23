import React from 'react';
import { View, Text, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MinimalBookingDetails = ({ booking }) => {
  const {
    bookingReference,
    type,
    bookingDate,
    paymentDate,
    status,
    selectedPayment,
    selectedRoomType,
    porterName,
    hostelName,
    institution,
    phone,
    gender,
    frontImage,
  } = booking;

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'paid':
        return '#27ae60';
      case 'pending':
        return '#f39c12';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'paid':
        return 'checkmark-circle-outline';
      case 'pending':
        return 'time-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'information-circle-outline';
    }
  };

  const renderInfoRow = (icon, label, value, isHighlight = false) => {
    if (!value || value === 'N/A') return null;
    return (
      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={16} color="#7f8c8d" />
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={[styles.infoValue, isHighlight && styles.highlightValue]}>
            {value}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Booking Summary</Text>
        {status && (
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
            <Ionicons name={getStatusIcon(status)} size={14} color="#fff" style={styles.statusIcon} />
            <Text style={styles.statusText}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Image */}
      {frontImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: frontImage }} style={styles.image} />
          <View style={styles.imageOverlay}>
            <Text style={styles.hostelNameOverlay}>{hostelName}</Text>
          </View>
        </View>
      )}

      {/* Main Info */}
      <View style={styles.mainInfo}>
        {renderInfoRow('home-outline', 'Hostel Name', hostelName, true)}

        {/* Room type and institution on same line */}
        <View style={styles.dualRow}>
          <View style={{ flex: 1 }}>
            {renderInfoRow('bed-outline', 'Room Type', selectedRoomType)}
          </View>
          <View style={{ flex: 1 }}>
            {renderInfoRow('school-outline', 'Institution', institution)}
          </View>
        </View>
      </View>

      {/* Booking + Payment Date */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Booking Details</Text>
        {renderInfoRow('receipt-outline', 'Reference', bookingReference)}

        <View style={styles.dualRow}>
          <View style={{ flex: 1 }}>
            {renderInfoRow('calendar-outline', 'Booking Date', formatDate(bookingDate))}
          </View>
          <View style={{ flex: 1 }}>
            {paymentDate && renderInfoRow('calendar-outline', 'Payment Date', formatDate(paymentDate))}
          </View>
        </View>
      </View>

      {/* Payment Info */}
      <View style={styles.paymentSection}>
        <View style={styles.paymentRow}>
          <View style={styles.paymentIcon}>
            <Ionicons name="card-outline" size={20} color="#27ae60" />
          </View>
          <View style={styles.paymentContent}>
            <Text style={styles.paymentLabel}>Amount Paid</Text>
            <Text style={styles.paymentAmount}>₵{selectedPayment || '0'}</Text>
          </View>
        </View>
      </View>

      {/* Porter Contact Info */}
      {(porterName || phone) && (
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Porter Contact</Text>

          {porterName && renderInfoRow('person-circle-outline', 'Porter', porterName)}

          {phone && (
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => Linking.openURL(`tel:${phone}`)}
            >
              <Ionicons name="call-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.callText}>Call Porter ({phone})</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#2c3e50' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIcon: { marginRight: 4 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  imageContainer: {
    position: 'relative',
    margin: 20,
    marginBottom: 16,
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  hostelNameOverlay: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  mainInfo: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  detailsSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  dualRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  paymentSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8fffe',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e8f5f3',
  },
  contactSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: { flex: 1 },
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  highlightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8e0002',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentContent: { flex: 1 },
  paymentLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
    marginBottom: 2,
  },
  paymentAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#27ae60',
  },
  callButton: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  callText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default MinimalBookingDetails;
