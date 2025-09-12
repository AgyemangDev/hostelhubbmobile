import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../../constants/Colors";

const LoginLink = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.text}>Already have an account?</Text>
        <Text style={styles.linkText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginRight: 5,
  },
  linkText: {
    fontSize: 16,
    textAlign: "center",
    color: COLORS.background,
    fontWeight: "500",
  },
});

export default LoginLink;