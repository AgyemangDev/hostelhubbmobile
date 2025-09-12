import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // Make sure this package is installed

const AvailabilityBadge = ({ availability }) => {
  return (
    <View style={[styles.badge, availability ? styles.available : styles.full]}>
      <Ionicons
        name={availability ? "checkmark-circle-outline" : "close-circle-outline"}
        size={14}
        color="#fff"
        style={styles.icon}
      />
      <Text style={styles.text}>
        {availability ? "Available" : "Full"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    marginLeft: 8,
  },
  available: {
    backgroundColor: '#28a745', // soft green
  },
  full: {
    backgroundColor: '#dc3545', // soft red
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  icon: {
    marginRight: 2,
  },
});

export default AvailabilityBadge;
