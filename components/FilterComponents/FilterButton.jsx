import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FilterButton = ({ onPress, size = 46 }) => {
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
});