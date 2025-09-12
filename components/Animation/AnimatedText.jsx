// animations/AnimatedText.js
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import COLORS from "../../constants/Colors";

const AnimatedText = ({ appName, tagline }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const underlineWidthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(underlineWidthAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.textContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.appName}>{appName}</Text>
      <Animated.View
        style={[
          styles.underline,
          {
            width: underlineWidthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "80%"],
            }),
          },
        ]}
      />
      <Text style={styles.tagline}>{tagline}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
    letterSpacing: 1,
  },
  underline: {
    height: 2,
    backgroundColor: COLORS.background,
    marginBottom: 14,
  },
  tagline: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 6,
  },
});

export default AnimatedText;