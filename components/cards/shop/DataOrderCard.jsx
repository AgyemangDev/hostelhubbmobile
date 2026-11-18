import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from "../../../constants/theme";

const STATUS_CONFIG = {
  placed: {
    label:      'Placed',
    badge:      { backgroundColor: colors.fill },
    text:       { color: colors.brand },
  },
  processing: {
    label:      'Processing',
    badge:      { backgroundColor: colors.warningBg },
    text:       { color: colors.warningText },
  },
  delivered: {
    label:      'Delivered',
    badge:      { backgroundColor: colors.brandSoft },
    text:       { color: colors.success },
  },
}

const DataOrderCard = ({ bundle, orderStatus, customer_phone }) => {
  const status = STATUS_CONFIG[orderStatus] ?? STATUS_CONFIG.placed

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{bundle}GB Bundle</Text>
        <View style={[styles.badge, status.badge]}>
          <Text style={[styles.badgeText, status.text]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.separator} />

      <View>
        <Text style={styles.label}>Receiving Contact:</Text>
        <Text style={styles.value}>{customer_phone}</Text>
      </View>
    </View>
  )
}

export default DataOrderCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: colors.fill,
    marginVertical: 10,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
})