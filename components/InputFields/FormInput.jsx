import React from "react";
import { StyleSheet, TextInput, View, TouchableOpacity, Platform } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import COLORS from "../../constants/Colors";

const FormInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  isPasswordInput = false,
  isPasswordVisible,
  togglePasswordVisibility,
  disabled = false,
}) => {
  if (isPasswordInput) {
    return (
      <View style={[styles.passwordContainer, disabled && styles.inputDisabled]}>
        <TextInput
          style={styles.passwordInput}
          placeholder={placeholder}
          secureTextEntry={!isPasswordVisible}
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconWrapper}>
          <Entypo
            name={isPasswordVisible ? "eye" : "eye-with-line"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TextInput
      style={[styles.input, disabled && styles.inputDisabled]}
      placeholder={placeholder}
      keyboardType={keyboardType}
      placeholderTextColor="#aaa"
      value={value}
      onChangeText={onChangeText}
      editable={!disabled}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
    borderColor: COLORS.background,
    borderWidth: 1,
    marginBottom: 16,
    width: "100%",
    fontSize: 16,
    color: "#333",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  inputDisabled: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 16,
    borderColor: COLORS.background,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 52,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  iconWrapper: {
    paddingLeft: 10,
    paddingVertical: 6,
  },
});

export default FormInput;
