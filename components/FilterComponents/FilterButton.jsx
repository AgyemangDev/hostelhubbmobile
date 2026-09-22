import React from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FilterButton = ({ onPress, size = 46, activeCount = 0 }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      android_ripple={{ color: "#eee", borderless: true }}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="options-outline" size={22} color="#333" />
        {activeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{activeCount > 9 ? "9+" : activeCount}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default FilterButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,

    // shadow
    elevation: 3,
    shadowColor: "#520000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },

  iconWrap: {
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -9,
    right: -12,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: "#610b0c",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
});