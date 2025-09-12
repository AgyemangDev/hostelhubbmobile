import React from "react";
import { View, Text, StyleSheet, StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../constants/Colors";

const Header = ({ count }) => {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <Text style={styles.headerTitle}>Wishlist</Text>
        </View>
        <View style={styles.countContainer}>
          <Text style={styles.headerCount}>
            {count} {count === 1 ? "hostel" : "hostels"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.background,
    letterSpacing: -0.5,
  },
  countContainer: {
    backgroundColor: "rgba(0,0,0,0.04)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerCount: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555555",
  },
});