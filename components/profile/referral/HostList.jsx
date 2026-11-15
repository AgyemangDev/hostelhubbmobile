import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TEAL = '#0F6E56';
const TEAL_LIGHT = '#E1F5EE';
const TEAL_DARK = '#085041';

const HostsList = ({ hosts }) => {
  if (!hosts.length) {
    return (
      <Text style={styles.empty}>
        No hosts referred yet. Share your code to get started.
      </Text>
    );
  }

  return hosts.map(h => (
    <View key={h.id} style={styles.hostCard}>
      <View style={styles.hostAvatar}>
        <Text style={styles.hostAvatarText}>
          {(h.firstname?.[0] || '') + (h.surname?.[0] || '')}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.hostName}>
          {h.firstname} {h.surname}
        </Text>

        <Text style={styles.hostMeta}>
          Joined{' '}
          {new Date(h.joinedAt).toLocaleDateString('en-GB', {
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.hostBookings}>
          {h.paidBookings}
        </Text>
        <Text style={styles.hostBookingsLbl}>
          paid bookings
        </Text>
      </View>
    </View>
  ));
};

export default HostsList;

const styles = StyleSheet.create({
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },

  hostAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: TEAL_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  hostAvatarText: {
    fontSize: 13,
    fontWeight: '500',
    color: TEAL_DARK,
  },

  hostName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
  },

  hostMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  hostBookings: {
    fontSize: 15,
    fontWeight: '500',
    color: TEAL,
  },

  hostBookingsLbl: {
    fontSize: 11,
    color: '#999',
  },

  empty: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 40,
  },
});