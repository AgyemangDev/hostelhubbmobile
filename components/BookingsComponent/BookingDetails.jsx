import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For call icon
import * as Linking from 'expo-linking';

const BookingDetails = ({ hostel, admin }) => {
  const manager = admin || {};
  const frontImage = hostel?.frontImage;

  // Capitalize room types
  const formatRoomType = (type) => {
    return type === "OneInARoom" ? "One In A Room" : type === "TwoInARoom" ? "Two In A Room" : type;
  };

  const callNumber = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={styles.container}>
      {/* Hostel Image on Left */}
      <Image source={{ uri: frontImage }} style={styles.hostelImage} />

      {/* Hostel Details on Right */}
      <View style={styles.hostelDetails}>
        <View style={styles.badgeContainer}>
          <Text style={styles.paidBadge}>Paid</Text>
        </View>
        <Text style={styles.hostelName}>{hostel?.hostelName || 'Hostel not found'}</Text>
        <Text style={styles.locationText}>Location: {hostel?.location}</Text>

        {/* Manager Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Manager</Text>
          <View style={styles.row}>
            <Text style={styles.infoText}>{manager.firstname} {manager.surname}</Text>
            <TouchableOpacity onPress={() => callNumber(manager.phone)}>
              <Ionicons name="call" size={20} color="blue" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Porter Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Porter</Text>
          <View style={styles.row}>
            <Text style={styles.infoText}>{hostel.porter}</Text>
            <TouchableOpacity onPress={() => callNumber(hostel.porterContact)}>
              <Ionicons name="call" size={20} color="blue" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  hostelImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
  },
  hostelDetails: {
    flex: 1,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  paidBadge: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontWeight: 'bold',
    fontSize: 12,
  },
  hostelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 5,
  },
  infoSection: {
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
});

export default BookingDetails;
