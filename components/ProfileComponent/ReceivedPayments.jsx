import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTransactions } from "../../context/TransactionContext";
import { auth } from "../../app/firebase/FirebaseConfig";
import EmptyState from "../BookingsComponent/EmptyState";

const PaymentsMadeToHostels = () => {
  const { transactions } = useTransactions();
  const userId = auth.currentUser.uid;
  console.log(transactions);

  // Separate transactions with null createdAt and transactions with valid createdAt
  const [validTransactions, nullTransactions] = transactions.reduce(
    (acc, transaction) => {
      if (transaction.createdAt?.seconds) {
        acc[0].push(transaction); // valid transaction
      } else {
        acc[1].push(transaction); // null createdAt
      }
      return acc;
    },
    [[], []]
  );

  // Sort valid transactions by date (newest first)
  const sortedTransactions = validTransactions.sort((a, b) => {
    const aDate = new Date(a.createdAt.seconds * 1000);
    const bDate = new Date(b.createdAt.seconds * 1000);
    return bDate - aDate; // Sort in descending order (newest first)
  });

  // Combine sorted valid transactions with the null transactions at the bottom
  const allTransactions = [...nullTransactions,...sortedTransactions];

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return ""; // Skip formatting if timestamp is null
    const date = new Date(timestamp.seconds * 1000);
    const options = { month: "long", day: "numeric", year: "numeric" };
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
    return `${date.toLocaleDateString(undefined, options)}, ${date.toLocaleTimeString(
      undefined,
      timeOptions
    )}`;
  };

  const renderTransactionItem = (item) => {
    const { method, amount, createdAt, status, hostelName } = item;
    const amountColor =
      method === "Hostel Payment"
        ? "#8B4513"
        : method === "Wallet Deposit"
        ? "green"
        : method === "Withdrawal"
        ? "red"
        : "black";

    return (
      <View key={`${item.amount}-${item.createdAt?.seconds || "null"}`} style={styles.transactionCard}>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>
{(method === "Hostel Payment" || method === "Video Booking Payment")
              ? `Payment to ${hostelName}`
              : method === "HostelHubb Payment"
              ? "Hostelhubb Subscription"
              : method === "Storage Payment" 
              ? "Storage Payment"
              : method === "Wallet Deposit"
              ? "Deposit to Wallet"
              : method === "Withdrawal"
              ? "Withdrawal from Wallet"
              : "Referral Bonus"}
          </Text>
          {createdAt?.seconds && <Text style={styles.transactionDate}>{formatDate(createdAt)}</Text>}
        </View>
        <View style={styles.transactionInfo}>
          <Text style={[styles.transactionAmount, { color: amountColor }]}>
            ₵{amount.toLocaleString()}
          </Text>
          {method === "Withdrawal" && (
            <Text style={styles.transactionStatus}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {allTransactions.length > 0 ? (
        <ScrollView contentContainerStyle={styles.listContent}>
          {allTransactions.map(renderTransactionItem)}
        </ScrollView>
      ) : (
        <EmptyState message="No transactions yet" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  transactionDate: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  transactionInfo: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionStatus: {
    fontSize: 12,
    marginTop: 5,
    color: "gray", // Status for withdrawal only
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default PaymentsMadeToHostels;
