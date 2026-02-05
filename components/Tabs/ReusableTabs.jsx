import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import COLORS from "../../constants/Colors";

/**
 * Reusable Tabs Component
 * @param {Array} tabs - Array of tab objects: { id: string, label: string, content: ReactNode }
 * @param {string} initialTab - Optional: default selected tab id
 */
const ReusableTabs = ({ tabs, initialTab }) => {
  const [selectedTab, setSelectedTab] = useState(initialTab || tabs[0].id);

  const activeTabObj = tabs.find((tab) => tab.id === selectedTab);

  return (
    <View style={styles.container}>
      {/* Tabs Header */}
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              style={[
                styles.tabButton,
                selectedTab === tab.id && styles.activeTabButton,
              ]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.id && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Tabs Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {activeTabObj?.content}
      </ScrollView>
    </View>
  );
};

export default ReusableTabs;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  },
  activeTabButton: {
    backgroundColor: COLORS.background,
    shadowColor: "#610b0c",
    shadowOffset: { width: 0, height: 2 },
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