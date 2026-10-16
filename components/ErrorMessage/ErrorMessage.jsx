import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import errorImage from "../../assets/images/Errors/General.gif"; 

const ErrorMessage = ({ message, title = "Oops! Something went wrong" }) => {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Image source={errorImage} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default ErrorMessage;