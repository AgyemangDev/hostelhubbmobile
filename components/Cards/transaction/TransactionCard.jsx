import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TransactionCard = ({
  id,
  method,
  amount,
  created_at,
  status,
  hostel_name,
  formatDate,
}) => {
  const amountColor = status === "pending" ? "red" : "green";

  const getTitle = () => {
    switch (method) {
      case "Hostel Payment":
      case "Video Booking Payment":
        return `Payment for Accommodation`;
      case "HostelHubb Payment":
        return "Hostelhubb Subscription";
      case "Storage Payment":
        return "Storage Payment";
      case "Deposit":
        return "Deposit to Wallet";
      case "Withdrawal":
        return "Withdrawal from Wallet";
      default:
        return "Referral Bonus";
    }
  };

  return (
    <View style={styles.transactionCard}>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{getTitle()}</Text>

        {created_at && (
          <Text style={styles.transactionDate}>
            {formatDate(created_at)}
          </Text>
        )}
      </View>

      <View style={styles.transactionInfo}>
        <Text style={[styles.transactionAmount, { color: amountColor }]}>
          ₵{Number(amount).toLocaleString()}
        </Text>
        <Text style={[styles.transactionStatus, { color: amountColor }]}>
          ({status.charAt(0).toUpperCase() + status.slice(1)})
        </Text>
      </View>
    </View>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },

  transactionDetails: {
    flex: 1,
    paddingRight: 10,
  },

  transactionTitle: {
    fontSize: 15.5,
    fontWeight: "600",
    color: "#222",
  },

  transactionDate: {
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 4,
  },

  transactionInfo: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 90,
  },

  transactionAmount: {
    fontSize: 15.5,
    fontWeight: "700",
  },

  transactionStatus: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: "500",
  },
});