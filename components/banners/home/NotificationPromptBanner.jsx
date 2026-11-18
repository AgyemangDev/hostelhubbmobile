import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../ui";
import { colors } from "../../../constants/theme";

const NotificationPromptBanner = ({ onEnable }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="notifications-outline" size={24} color={colors.warningText} />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>Enable Notifications</Text>
        <Text style={styles.description}>
          Get instant updates on your bookings and special offers
        </Text>
      </View>
      
      <Button title="Enable" size="sm" compact onPress={onEnable} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.warningBg,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  enableButton: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: "700",
  },
});

export default NotificationPromptBanner;