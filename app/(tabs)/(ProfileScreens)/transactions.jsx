import React from "react";
import { View } from "react-native";
import ReusableTabs from "../../../components/Tabs/ReusableTabs";
import TransactionsMade from "../../../components/ProfileComponent/TransactionsMade";
import RewardsTab from "../../../components/ProfileComponent/RewardsTab";

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