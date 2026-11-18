import React, { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TransactionContext } from "../../../context/TransactionContext";
import TransactionList from "../../lists/transactions/TransactionList";
import TransactionCardShimmer from "../../skeletons/transactions/TransactionCardShimmer";
import { formatDate } from "../../../utils/formatDate";
import { EmptyState } from "../../ui";
import { colors } from "../../../constants/theme";

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
        <EmptyState illustration="empty" title="No transactions yet" />
      )}
    </View>
  );
};

export default TransactionsMade;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
});