import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons'; // Clean and modern icon set
import COLORS from '../../../constants/Colors';

const StatsRow = ({views, viewText }) => (
  <View style={styles.row}>
    <View style={styles.item}>
      <Feather name="eye" size={15} color={COLORS.grey} style={styles.icon} />
      <Text style={styles.text}>{views} {viewText}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 13.5,
    color: COLORS.grey,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 12,
    borderRadius: 1,
  },
});

export default StatsRow;
