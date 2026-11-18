// components/skeletons/hubclipps/HubClipSkeleton.jsx
//
// Full-screen placeholder for the Hubclips feed, drawn on the same black
// frame the clips play on (so there's no grey-to-black flash when the first
// clip arrives) and laid out exactly like HubClip's overlay:
//   top     "For you" tab, post (+) and filter buttons    (FilterOverlay)
//   left    title (2 lines), room · type, location, amenities   (LeftInfo)
//   right   poster, Save, views, Share                       (RightActions)
//   bottom  price + caption, white Reserve pill         (ReservationButton)
// A soft light sweeps across the frame while the play button pulses.
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, Platform, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Skeleton } from "../../ui";
import PlayPulse from "../../animations/hubclipps/PlayPulse";
import useReducedMotion from "../../../hooks/useReducedMotion";
import { space } from "../../../constants/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// Same offsets HubClip uses, so nothing jumps when the real clip replaces this.
const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 83 : 60;

const Dark = (props) => <Skeleton tone="dark" {...props} />;

function SideAction({ label = 30 }) {
  return (
    <View style={styles.action}>
      <Dark variant="circle" height={30} />
      <Dark variant="text" width={label} height={10} />
    </View>
  );
}

function LightSweep() {
  const x = useRef(new Animated.Value(-1)).current;
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(x, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.delay(500),
        Animated.timing(x, { toValue: -1, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, x]);

  if (reduced) return null;
  const translateX = x.interpolate({ inputRange: [-1, 1], outputRange: [-SCREEN_WIDTH * 1.2, SCREEN_WIDTH * 1.2] });
  return (
    <Animated.View pointerEvents="none" style={[styles.sweep, { transform: [{ translateX }, { rotate: "18deg" }] }]}>
      <LinearGradient
        colors={["transparent", "rgba(255,255,255,0.06)", "transparent"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

export default function HubClipSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container} accessible accessibilityLabel="Loading room tours">
      {/* The faint "video" behind everything: a little lift in the middle, darker at the edges. */}
      <LinearGradient colors={["#1C1917", "#262321", "#141210"]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
      <LightSweep />

      {/* Same bottom scrim a playing clip gets under its text. */}
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.55)"]} style={styles.scrim} pointerEvents="none" />

      <View style={styles.center} pointerEvents="none">
        <PlayPulse tone="dark" />
        <Text style={styles.hint}>Loading room tours…</Text>
      </View>

      <View style={[styles.top, { top: insets.top + space.xs }]}>
        <Dark variant="pill" width={92} height={36} />
        <View style={styles.topActions}>
          <Dark variant="circle" height={40} />
          <Dark variant="circle" height={40} />
        </View>
      </View>

      <View style={[styles.overlay, { bottom: TAB_BAR_HEIGHT + 92 }]}>
        <View style={styles.info}>
          <Dark width="85%" height={22} radius={6} />
          <Dark width="55%" height={22} radius={6} />
          <Dark variant="text" width="45%" height={13} style={styles.gapTop} />
          <View style={styles.row}>
            <Dark variant="circle" height={14} />
            <Dark variant="text" width="60%" height={13} />
          </View>
          <Dark variant="text" width="75%" height={12} />
        </View>
        <View style={styles.column}>
          <Dark variant="circle" height={48} style={styles.poster} />
          <SideAction label={30} />
          <SideAction label={24} />
          <SideAction label={34} />
        </View>
      </View>

      <View style={[styles.bottom, { bottom: TAB_BAR_HEIGHT + 18 }]}>
        <View style={styles.price}>
          <Dark width={110} height={20} radius={6} />
          <Dark variant="text" width={130} height={11} />
        </View>
        <Dark width={128} height={52} radius={26} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: SCREEN_HEIGHT, width: "100%", backgroundColor: "#000", overflow: "hidden" },
  sweep: { position: "absolute", top: -SCREEN_HEIGHT * 0.25, height: SCREEN_HEIGHT * 1.5, width: SCREEN_WIDTH * 0.6, left: SCREEN_WIDTH * 0.2 },
  scrim: { position: "absolute", left: 0, right: 0, bottom: 0, height: SCREEN_HEIGHT * 0.45 },
  center: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  hint: { position: "absolute", top: SCREEN_HEIGHT / 2 + 56, color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: "600" },
  top: { position: "absolute", left: space.md, right: space.sm, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  topActions: { flexDirection: "row", gap: space.xs },
  overlay: { position: "absolute", left: 16, right: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  info: { flex: 1, gap: 6, paddingRight: 12 },
  gapTop: { marginTop: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  column: { alignItems: "center", gap: 22 },
  poster: { borderWidth: 2, borderColor: "rgba(255,255,255,0.25)" },
  action: { alignItems: "center", gap: 6 },
  bottom: { position: "absolute", left: 16, right: 16, flexDirection: "row", alignItems: "center", gap: space.md },
  price: { flex: 1, gap: 6 },
});
