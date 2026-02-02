import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const ChipSelector = ({ options, selected, onToggle }) => {
  return (
    <View style={styles.wrap}>
      {options.map(opt => {
        const active = selected.includes(opt.value);
        return (
          <Pressable
            key={opt.value}
            style={[styles.chip, active && styles.active]}
            onPress={() => onToggle(opt.value)}
          >
            <Text style={[styles.text, active && styles.activeText]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default ChipSelector;

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  active: {
    backgroundColor: "#610b0c",
    borderColor: "#610b0c",
  },
  text: { fontSize: 13 },
  activeText: { color: "#fff", fontWeight: "600" },
});