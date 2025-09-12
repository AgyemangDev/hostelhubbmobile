import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import ReceivedPayments from "../../../components/ProfileComponent/ReceivedPayments";
import BalanceInfo from "../../../components/ProfileComponent/BalanceInfo";
import WithdrawalScreen from "../../../components/ProfileComponent/WithdrawalScreen";

const TransactionsPage = () => {
  const [selectedTab, setSelectedTab] = useState("Balance Info");

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Pressable
          style={styles.tabButton}
          onPress={() => setSelectedTab("Balance Info")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Balance Info" && styles.activeTabText,
            ]}
          >
            Balance Info
          </Text>
          {selectedTab === "Balance Info" && <View style={styles.underline} />}
        </Pressable>

        <Pressable
          style={styles.tabButton}
          onPress={() => setSelectedTab("Withdraw Money")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Withdraw Money" && styles.activeTabText,
            ]}
          >
            Withdraw Money
          </Text>
          {selectedTab === "Withdraw Money" && (
            <View style={styles.underline} />
          )}
        </Pressable>

        <Pressable
          style={styles.tabButton}
          onPress={() => setSelectedTab("Received Payments")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Received Payments" && styles.activeTabText,
            ]}
          >
            Transactions
          </Text>
          {selectedTab === "Received Payments" && (
            <View style={styles.underline} />
          )}
        </Pressable>
      </View>

    
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false} // Hide vertical scrollbar
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
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },
  activeTabText: {
    color: "#610b0c",
    fontWeight: 500,
  },
  underline: {
    height: 2,
    backgroundColor: "#610b0c",
    marginTop: 5,
    width: "100%",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});
