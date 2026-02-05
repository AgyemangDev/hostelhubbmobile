import React from "react";
import { View } from "react-native";
import ReusableTabs from "../../../components/Tabs/ReusableTabs";
import TransactionsMade from "../../../components/ProfileComponent/TransactionsMade";
import BalanceInfo from "../../../components/ProfileComponent/BalanceInfo";
import WithdrawalScreen from "../../../components/ProfileComponent/WithdrawalScreen";

const TransactionsPage = () => {
  const tabs = [
    { id: "balance", label: "Balance", content: <BalanceInfo /> },
    { id: "transactions", label: "Transactions", content: <TransactionsMade /> },
    // { id: "withdraw", label: "Withdraw", content: <WithdrawalScreen /> },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ReusableTabs tabs={tabs} initialTab="balance" />
    </View>
  );
};

export default TransactionsPage;