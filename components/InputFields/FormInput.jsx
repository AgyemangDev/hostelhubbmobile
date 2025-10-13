import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
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
  return isPasswordInput ? (
    <View style={[styles.passwordContainer, disabled && styles.inputDisabled]}>
      <TextInput
        style={styles.passwordInput}
        placeholder={placeholder}
        placeholderTextColor="#888"
        secureTextEntry={!isPasswordVisible}
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
      />
      <TouchableOpacity
        onPress={togglePasswordVisibility}
        style={styles.iconWrapper}
      >
        <Entypo
          name={isPasswordVisible ? "eye" : "eye-with-line"}
          size={24}
          color="#555"
        />
      </TouchableOpacity>
    </View>
  ) : (
    <TextInput
      style={[styles.input, disabled && styles.inputDisabled]}
      placeholder={placeholder}
      keyboardType={keyboardType}
      placeholderTextColor="#888"
      value={value}
      onChangeText={onChangeText}
      editable={!disabled}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    height: 54,
    paddingHorizontal: 18,
    marginBottom: 16,
    width: "100%",
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 14,
    marginBottom: 16,
    height: 54,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  iconWrapper: {
    paddingLeft: 12,
    paddingVertical: 6,
  },
  inputDisabled: {
    backgroundColor: "#f2f2f2",
    color: "#aaa",
    borderColor: "#ddd",
  },
});

export default FormInput;
