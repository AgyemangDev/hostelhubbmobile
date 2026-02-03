import React from "react";
import { View, StyleSheet } from "react-native";

const TransactionCardShimmer = () => {
  return (
    <View style={styles.card}>
      <View style={styles.details}>
        <View style={styles.title} />
        <View style={styles.date} />
      </View>

      <View style={styles.info}>
        <View style={styles.amount} />
        <View style={styles.status} />
      </View>
    </View>
  );
};

export default TransactionCardShimmer;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },

  details: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    height: 16,
    width: "70%",
    backgroundColor: "#E1E1E1",
    borderRadius: 4,
  },

  date: {
    height: 12,
    width: "50%",
    backgroundColor: "#ECECEC",
    borderRadius: 4,
    marginTop: 8,
  },

  info: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 90,
  },

  amount: {
    height: 16,
    width: 60,
    backgroundColor: "#E1E1E1",
    borderRadius: 4,
  },

  status: {
    height: 12,
    width: 45,
    backgroundColor: "#ECECEC",
    borderRadius: 4,
    marginTop: 6,
  },
});