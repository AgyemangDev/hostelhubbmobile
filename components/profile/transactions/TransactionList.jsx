import React from "react";
import { FlatList, ActivityIndicator } from "react-native";
import TransactionCard from "./TransactionCard";

const TransactionList = ({
  transactions,
  formatDate,
  refreshing,
  onRefresh,
  onEndReached,
  hasMore,
  loading,
}) => {
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TransactionCard {...item} formatDate={formatDate} />
      )}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={hasMore ? onEndReached : null}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={
        loading && hasMore ? <ActivityIndicator size="small" /> : null
      }
    />
  );
};

export default TransactionList;