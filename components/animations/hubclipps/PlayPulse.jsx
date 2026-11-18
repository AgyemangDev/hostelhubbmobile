import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Icon } from "../../ui";
import useReducedMotion from "../../../hooks/useReducedMotion";
import { colors } from "../../../constants/theme";

/**
 * Pulsing play button with an expanding ring, centred over a clip that is still loading.
 * tone: light (default, grey on a light frame) | dark (translucent white on the black video frame)
 */
export default function PlayPulse({ tone = "light" }) {
  const dark = tone === "dark";
  const ringOpacity = useRef(new Animated.Value(0.6)).current;
  const ringScale = useRef(new Animated.Value(1)).current;
  const playOpacity = useRef(new Animated.Value(0.5)).current;
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const ring = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 1.8, duration: 1200, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(playOpacity, { toValue: 0.9, duration: 900, useNativeDriver: true }),
        Animated.timing(playOpacity, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    );
    ring.start();
    pulse.start();
    return () => {
      ring.stop();
      pulse.stop();
    };
  }, [reduced, ringOpacity, ringScale, playOpacity]);

  return (
    <View style={styles.center} pointerEvents="none">
      <Animated.View style={[styles.ring, dark && styles.ringDark, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]} />
      <Animated.View style={[styles.play, dark && styles.playDark, { opacity: playOpacity }]}>
        <Icon name="play" size={28} color={dark ? colors.textInverse : colors.textMuted} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" },
  ring: { position: "absolute", width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: "#B0B0B0" },
  ringDark: { borderColor: "rgba(255,255,255,0.35)" },
  playDark: { backgroundColor: "rgba(255,255,255,0.14)" },
  play: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#D0D0D0", justifyContent: "center", alignItems: "center", paddingLeft: 4 },
});
