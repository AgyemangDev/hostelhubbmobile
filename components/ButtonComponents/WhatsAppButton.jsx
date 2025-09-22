import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Linking, StyleSheet, Image, Animated } from 'react-native';
import WhatsappImage from "../../assets/images/whatsapp.png";

export const WhatsAppButton = ({ size = 40 }) => {
  const phoneNumber = "233245746198"; // without +
  const message = "Hi, I need support!"; 

  // Animation reference
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Infinite pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  const openWhatsApp = () => {
    let url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      alert("Make sure WhatsApp is installed on your device");
    });
  };

  return (
    <Animated.View
      style={[
        styles.outerCircle,
        { width: size + 8, height: size + 8, borderRadius: (size + 20) / 1, transform: [{ scale: scaleAnim }] }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          { width: size, height: size, borderRadius: size / 2 }
        ]}
        onPress={openWhatsApp}
        activeOpacity={0.7}
      >
        <Image
          source={WhatsappImage}
          style={{
            width: size * 0.6,
            height: size * 0.6,
            resizeMode: "contain"
          }}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerCircle: {
    backgroundColor: "#25D366", // outer green circle
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  button: {
    backgroundColor: "#fff", // inner green
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
