import React, { useState, useRef } from "react";
import {
  View, Text, Pressable, ScrollView,
  StyleSheet, Animated, LayoutAnimation, Platform, UIManager,
} from "react-native";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// ReusableTabs.jsx
const ReusableTabs = ({ tabs, initialTab }) => {
  const [selectedTab, setSelectedTab] = useState(initialTab || tabs[0].id);

  const handleSelect = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedTab(id);
  };

  const activeTabObj = tabs.find((tab) => tab.id === selectedTab);

  return (
    <View style={styles.container}>
      {/* Tab bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              style={styles.tabItem}
              onPress={() => handleSelect(tab.id)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.indicator} />}
            </Pressable>
          );
        })}
      </View>

      {/* Content — flex:1 so children can fill remaining height */}
      <View style={styles.content}>
        {activeTabObj?.content}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e8e8e8",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    position: "relative",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#bbb",
  },
  tabTextActive: {
    color: "#1a1a1a",
    fontWeight: "600",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: "20%",
    right: "20%",
    height: 2,
    borderRadius: 2,
    backgroundColor: "#1a1a1a",
  },
  // ✅ replaces scrollContainer
  content: {
    flex: 1,
  },
});

export default ReusableTabs;
