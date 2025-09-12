import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import COLORS from "../../constants/Colors"

const AnimatedLoader = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.loaderWrapper,
        {
          transform: [{ rotate: rotation }],
        },
      ]}
    >
      <View style={styles.innerCircle}>
        <Text style={styles.loaderText}>H</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loaderWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
});

export default AnimatedLoader;