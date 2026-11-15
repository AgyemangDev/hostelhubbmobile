import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Platform, Animated } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

function ShimmerBlock({ style }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[style, { opacity }]} />;
}

function PlayIndicator() {
  const rippleOpacity = useRef(new Animated.Value(0.6)).current;
  const rippleScale = useRef(new Animated.Value(1)).current;
  const playOpacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Ripple expanding outward
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(rippleScale, { toValue: 1.8, duration: 1200, useNativeDriver: true }),
          Animated.timing(rippleOpacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(rippleScale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(rippleOpacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // Play button gentle pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(playOpacity, { toValue: 0.9, duration: 900, useNativeDriver: true }),
        Animated.timing(playOpacity, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.playContainer}>
      {/* Ripple ring */}
      <Animated.View
        style={[
          styles.ripple,
          { opacity: rippleOpacity, transform: [{ scale: rippleScale }] },
        ]}
      />
      {/* Play button circle */}
      <Animated.View style={[styles.playButton, { opacity: playOpacity }]}>
        {/* Triangle using border trick */}
        <View style={styles.playTriangle} />
      </Animated.View>
    </View>
  );
}

export default function HubClipSkeleton() {
  const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 83 : 60;

  return (
    <View style={styles.container}>
      <View style={styles.videoPlaceholder} />

      {/* Play indicator centered on screen */}
      <PlayIndicator />

      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={{ gap: 12 }}>
          <ShimmerBlock style={styles.titleBlock} />
          <ShimmerBlock style={styles.locationBlock} />
          <ShimmerBlock style={styles.amenitiesBlock} />
        </View>
        <View style={{ alignItems: "center", gap: 25 }}>
          <ShimmerBlock style={styles.avatarCircle} />
          <ShimmerBlock style={styles.viewsBlock} />
        </View>
      </View>

      {/* Reservation Button */}
      <View style={[styles.bottom, { bottom: TAB_BAR_HEIGHT + 10 }]}>
        <ShimmerBlock style={styles.buttonBlock} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "#f2f2f2",
  },

  videoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#e8e8e8",
  },

  // Play indicator
  playContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  ripple: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#b0b0b0",
  },

  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#d0d0d0",
    justifyContent: "center",
    alignItems: "center",
  },

  playTriangle: {
    width: 0,
    height: 0,
    marginLeft: 4, // optical centering
    borderTopWidth: 11,
    borderBottomWidth: 11,
    borderLeftWidth: 18,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#a0a0a0",
  },

  // Overlay
  overlay: {
    position: "absolute",
    bottom: 170,
    left: 15,
    right: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  bottom: {
    position: "absolute",
    left: 15,
    right: 15,
  },

  titleBlock: { width: 200, height: 20, borderRadius: 6, backgroundColor: "#d0d0d0" },
  locationBlock: { width: 240, height: 15, borderRadius: 6, backgroundColor: "#d0d0d0" },
  amenitiesBlock: { width: 260, height: 15, borderRadius: 6, backgroundColor: "#d0d0d0" },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#d0d0d0" },
  viewsBlock: { width: 35, height: 14, borderRadius: 6, backgroundColor: "#d0d0d0" },
  buttonBlock: { height: 45, borderRadius: 8, backgroundColor: "#d0d0d0" },
});