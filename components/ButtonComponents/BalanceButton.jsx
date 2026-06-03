// BalanceButton.jsx
// Floating balance pill — sits above the WhatsApp FAB in the bottom-right corner.
// Drop this into index.jsx alongside <WhatsAppButton />.

import React, { useContext } from "react";
import { Pressable, View, Text, StyleSheet, Animated } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { UserContext } from "../../context/UserContext";
import COLORS from "../../constants/Colors";

const BalanceButton = () => {
  const context = useContext(UserContext);
    const { userInfo } = useContext(UserContext);
  const router = useRouter();
  const balance = userInfo?.balance ?? 0.0;

  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.93, useNativeDriver: true }).start();

  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  const handlePress = () => {
  if (!userInfo) {
    router.push("/(ProfileScreens)");
    return;
  }
  router.push("/transactions");
}

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.fab}
    >
      <Animated.View style={[styles.pill, { transform: [{ scale: scaleAnim }] }]}>
        <MaterialIcons name="account-balance-wallet" size={15} color="rgba(255,255,255,0.85)" style={styles.icon} />
        <View>
          <Text style={styles.label}>Top Up</Text>
          <Text style={styles.amount}>₵{balance.toFixed(2)}</Text>
        </View>
        <FontAwesome5 name="chevron-right" size={9} color="rgba(255,255,255,0.5)" style={styles.chevron} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 90,   // sits above the WhatsApp FAB (which is ~bottom: 20, size 60)
    right: 16,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background, // your dark red brand color
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 10,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 13,
  },
  amount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 18,
  },
  chevron: {
    marginLeft: 8,
  },
});

export default BalanceButton;