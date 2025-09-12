import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/Colors';

const HeaderTextBlock = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Welcome to</Text>
      <Text style={styles.brandText}>HostelHubb</Text>
    </View>
  );
};

export default HeaderTextBlock;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 16,
    color: COLORS.background,
    marginBottom: 2,
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.background,
  },
});
