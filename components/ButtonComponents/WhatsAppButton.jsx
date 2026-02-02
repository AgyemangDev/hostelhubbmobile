import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Linking,View, StyleSheet, Image, Animated } from 'react-native';
import WhatsappImage from "../../assets/images/whatsapp.png";
import DepositButton from './DepositButton';

export const WhatsAppButton = ({ size = 56 }) => {
  const phoneNumber = "233245746198";
  const message = "Hi, I need help with [please describe your issue here]"; 

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const openWhatsApp = () => {
    let url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      alert("Make sure WhatsApp is installed on your device");
    });
  };

  return (
    <View>
    <Animated.View
      style={[
        styles.outerCircle,
        { 
          width: size + 12, 
          height: size + 12, 
          borderRadius: (size + 12) / 2,
          transform: [{ scale: scaleAnim }] 
        }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          { width: size, height: size, borderRadius: size / 2 }
        ]}
        onPress={openWhatsApp}
        activeOpacity={0.8}
      >
        <Image
          source={WhatsappImage}
          style={{
            width: size * 0.55,
            height: size * 0.55,
            resizeMode: "contain"
          }}
        />
      </TouchableOpacity>
    </Animated.View>
    {/* <DepositButton/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  outerCircle: {
    backgroundColor: "#25D366",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 8,
    shadowColor: "#25D366",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  button: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});