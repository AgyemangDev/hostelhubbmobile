import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from "../../../constants/theme";

const BalanceDisplay = ({ balance,title }) => {
    const formattedBalance = `GHC ${balance.toLocaleString()}`;

  return (
    <>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.balanceContainer}>
    <MaterialIcons name="account-balance-wallet" size={24} color={colors.brand} />
    <View style={styles.balanceInfo}>
      <Text style={styles.balanceLabel}>Current Balance</Text>
      <Text style={styles.balanceValue}>{formattedBalance}</Text>
    </View>
  </View>
    </>
  );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: colors.text,
        textAlign: "center",
      },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.fill,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  balanceInfo: {
    marginLeft: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.brand,
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 5,
  },
});

export default BalanceDisplay;
