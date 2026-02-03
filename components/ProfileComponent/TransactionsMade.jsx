import React, { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TransactionContext } from "../../context/TransactionContext";
import EmptyState from "../BookingsComponent/EmptyState";
import TransactionList from "../Cards/transaction/TransactionList";
import TransactionCardShimmer from "../Loading/TransactionCardShimmer";
import { formatDate } from "../../utils/formatDate";

const TransactionsMade = () => {
  const {
    transactions,
    loading,
    refreshing,
    isInitialLoading,
    refreshTransactions,
    loadMoreTransactions,
    hasMore,
    fetchTransactions,
  } = useContext(TransactionContext);

  useEffect(() => {
    fetchTransactions({ reset: true });
  }, []);

  return (
    <View style={styles.container}>
      {isInitialLoading ? (
        <TransactionCardShimmer count={10} />
      ) : transactions.length > 0 ? (
        <TransactionList
          transactions={transactions}
          formatDate={formatDate}
          refreshing={refreshing}
          onRefresh={refreshTransactions}
          onEndReached={loadMoreTransactions}
          hasMore={hasMore}
          loading={loading}
        />
      ) : (
        <EmptyState message="No transactions yet" />
      )}
    </View>
  );
};

export default TransactionsMade;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
});