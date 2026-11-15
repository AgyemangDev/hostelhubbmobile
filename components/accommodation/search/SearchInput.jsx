import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({ value, onChangeText, placeholder = "Search", onPress }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  if (onPress) {
    // Button mode (for header)
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Ionicons name="search" size={22} color="#000" style={styles.icon} />
        <Text style={styles.placeholderText}>{placeholder}</Text>
      </TouchableOpacity>
    );
  }

  // Input mode (for search screen)
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={22} color="#000" style={styles.icon} />
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          isFocused || value ? styles.inputLeft : styles.inputCenter,
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Ionicons name="close-circle" size={20} color="#888" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: "100%", // full width of parent
  },
  icon: {
    marginRight: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: "#000",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  inputCenter: {
    textAlign: "center",
  },
  inputLeft: {
    textAlign: "left",
  },
});

export default SearchBar;