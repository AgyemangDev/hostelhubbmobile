import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";

const MultiSelectDropdown = ({ data, selectedValues = [], onToggle, placeholder, visible, onPress }) => {
  return (
    <>
      {/* Trigger */}
      <TouchableOpacity style={styles.trigger} onPress={onPress}>
        <Text style={[styles.triggerText, selectedValues.length === 0 && styles.placeholderText]}>
          {selectedValues.length > 0 ? selectedValues.join(", ") : placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={COLORS.background}
          style={{ transform: [{ rotate: visible ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>

      {/* Modal */}
      <Modal transparent visible={visible} animationType="slide">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onPress}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <FlatList
              data={data}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const selected = selectedValues.includes(item);
                return (
                  <TouchableOpacity
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => onToggle(item)}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default MultiSelectDropdown;

const styles = StyleSheet.create({
  trigger: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.background,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  triggerText: {
    fontSize: 16,
    color: COLORS.background,
    fontWeight: "500",
  },
  placeholderText: {
    color: COLORS.textMuted,
    fontWeight: "400",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    maxHeight: "45%",
  },
  sheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.background,
    alignSelf: "center",
    marginVertical: 10,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  optionSelected: {
    backgroundColor: COLORS.white,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  optionTextSelected: {
    color: COLORS.background,
    fontWeight: "600",
  },
});