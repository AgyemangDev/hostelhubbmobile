import React, { useEffect, useRef } from "react";
import { Animated, Image, Linking, StyleSheet } from "react-native";
import { IconButton } from "../../ui";
import useReducedMotion from "../../../hooks/useReducedMotion";
import WhatsappImage from "../../../assets/images/whatsapp.png";

const PHONE = "233245746198";
const MESSAGE = "Hi, I need help with [please describe your issue here]";

const openWhatsApp = () =>
  Linking.openURL(`whatsapp://send?phone=${PHONE}&text=${encodeURIComponent(MESSAGE)}`).catch(() => {
    alert("Make sure WhatsApp is installed on your device");
  });

/** Floating customer-care button, bottom right, with a slow pulse. */
export const WhatsAppButton = ({ size = 56 }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.1, duration: 1500, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale, reduced]);

  return (
    <Animated.View style={[styles.ring, { width: size + 12, height: size + 12, borderRadius: (size + 12) / 2, transform: [{ scale }] }]}>
      <IconButton
        variant="floating"
        accessibilityLabel="Chat with customer care on WhatsApp"
        onPress={openWhatsApp}
        icon={() => <Image source={WhatsappImage} style={{ width: size * 0.55, height: size * 0.55 }} resizeMode="contain" />}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    </Animated.View>
  );
};

export default WhatsAppButton;

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#25D366",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
