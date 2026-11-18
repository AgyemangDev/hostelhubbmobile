import React from "react";
import { View } from "react-native";
import TransactionsMade from "../../../components/sections/profile/TransactionsMade";
import RewardsTab from "../../../components/sections/profile/RewardsTab";
import { TabPanels } from "../../../components/ui";

const TransactionsPage = () => {
  const tabs = [
    { id: "transactions", label: "Transactions", content: <TransactionsMade /> },
    { id: "rewards", label: "Rewards", content: <RewardsTab /> },
  ];

  return (
    <View style={{ flex: 1 }}>
      <TabPanels tabs={tabs} initialTab="transactions" />
    </View>
  );
};

export default TransactionsPage;