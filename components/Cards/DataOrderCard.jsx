import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DataOrderCard = ({ bundle, delivered, customer_phone }) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{bundle}GB Bundle</Text>

        <View style={[
          styles.badge,
          delivered ? styles.badgeDelivered : styles.badgeProcessing
        ]}>
          <Text style={[
            styles.badgeText,
            delivered ? styles.textDelivered : styles.textProcessing
          ]}>
            {delivered ? "Delivered" : "Processing"}
          </Text>
        </View>
      </View>

      <View style={styles.separator} />

      <View>
        <Text style={styles.label}>Receiving Contact:</Text>
        <Text style={styles.value}>{customer_phone}</Text>
      </View>
    </View>
  );
};

export default DataOrderCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  badgeDelivered: {
    backgroundColor: '#E8FFEF',
  },
  badgeProcessing: {
    backgroundColor: '#FFF6DD',
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  textDelivered: {
    color: '#0BA360',
  },

  textProcessing: {
    color: '#C27A00',
  },

  separator: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginVertical: 10,
  },

  label: {
    fontSize: 12,
    color: '#6B7280',
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});
