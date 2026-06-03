import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import COLORS from "../../constants/Colors";

const FloatingLabelInput = ({
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
  const [isFocused, setIsFocused] = useState(false);

  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const barAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    const active = isFocused || !!value;
    Animated.parallel([
      Animated.timing(labelAnim, {
        toValue: active ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(barAnim, {
        toValue: active ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isFocused, value]);

  return (
    <View style={styles.container}>
      {/* Floating label */}
      <Animated.Text
        style={[
          styles.label,
          {
            top: labelAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [14, 0],
            }),
            fontSize: labelAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 11],
            }),
            color: labelAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [COLORS.placeholder, COLORS.background],
            }),
          },
        ]}
      >
        {placeholder}
      </Animated.Text>

      {/* Input */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPasswordInput ? !isPasswordVisible : secureTextEntry}
        keyboardType={keyboardType}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.input,
          { paddingRight: isPasswordInput ? 36 : 0 },
        ]}
      />

      {/* Animated underline bar */}
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: barAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>

      {/* Eye toggle */}
      {isPasswordInput && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconWrapper}
        >
          <Entypo
            name={isPasswordVisible ? "eye" : "eye-with-line"}
            size={20}
            color={COLORS.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FloatingLabelInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 16,
    marginBottom: 24,
  },
  label: {
    position: "absolute",
    left: 0,
  },
  input: {
    fontSize: 16,
    color: COLORS.textDark,
    paddingVertical: 6,
    paddingLeft: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  barTrack: {
    height: 1.5,
    backgroundColor: COLORS.placeholder,
    width: "100%",
  },
  barFill: {
    height: 1.5,
    backgroundColor: COLORS.background,
  },
  iconWrapper: {
    position: "absolute",
    right: 0,
    bottom: 10,
  },
});