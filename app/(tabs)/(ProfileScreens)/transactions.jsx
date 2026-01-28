import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import ReceivedPayments from "../../../components/ProfileComponent/ReceivedPayments";
import BalanceInfo from "../../../components/ProfileComponent/BalanceInfo";
import WithdrawalScreen from "../../../components/ProfileComponent/WithdrawalScreen";

const TransactionsPage = () => {
  const [selectedTab, setSelectedTab] = useState("Balance Info");

  const tabs = [
    { id: "Balance Info", label: "Balance" },
    // { id: "Withdraw Money", label: "Withdraw" },
    { id: "Received Payments", label: "Transactions" }
  ];

  return (
    <View style={styles.container}>
      {/* Modern Tabs */}
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              style={[
                styles.tabButton,
                selectedTab === tab.id && styles.activeTabButton
              ]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.id && styles.activeTabText
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {selectedTab === "Balance Info" && <BalanceInfo />}
        {selectedTab === "Received Payments" && <ReceivedPayments />}
        {selectedTab === "Withdraw Money" && <WithdrawalScreen />}
      </ScrollView>
    </View>
  );
};

export default TransactionsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabsWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    transition: "all 0.2s ease",
  },
  activeTabButton: {
    backgroundColor: "#610b0c",
    shadowColor: "#610b0c",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});