import React from "react";
import { View } from "react-native";
import ReusableTabs from "../../../components/ui/tabs/ReusableTabs";
import TransactionsMade from "../../../components/profile/TransactionsMade";
import RewardsTab from "../../../components/profile/RewardsTab";

const TransactionsPage = () => {
  const tabs = [
    { id: "transactions", label: "Transactions", content: <TransactionsMade /> },
    { id: "rewards", label: "Rewards", content: <RewardsTab /> },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ReusableTabs tabs={tabs} initialTab="transactions" />
    </View>
  );
};

export default TransactionsPage;