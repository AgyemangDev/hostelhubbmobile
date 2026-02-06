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
  disabled = false, // Changed default to false
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Animated value for label
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  // Label style interpolation
  const labelStyle = {
    position: "absolute",
    left: 16,
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.placeholder, COLORS.background],
    }),
    backgroundColor: COLORS.white,
    paddingHorizontal: 4,
  };

  const inputProps = {
    value,
    onChangeText,
    secureTextEntry: isPasswordInput ? !isPasswordVisible : secureTextEntry,
    keyboardType,
    editable: !disabled,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    style: [
      styles.input,
      { paddingLeft: 16, paddingRight: isPasswordInput ? 40 : 16 },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>
      <TextInput {...inputProps} />
      {isPasswordInput && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconWrapper}
        >
          <Entypo
            name={isPasswordVisible ? "eye" : "eye-with-line"}
            size={22}
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
    height: 54,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.background,
    marginBottom: 16,
    backgroundColor: COLORS.white,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    color: COLORS.textDark,
    flex: 1,
    height: "100%",
  },
  iconWrapper: {
    position: "absolute",
    right: 12,
    top: 14,
  },
});