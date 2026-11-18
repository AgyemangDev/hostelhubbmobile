import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import Text from "../typography/Text";
import useReducedMotion from "../../../hooks/useReducedMotion";
import { colors, motion, onVideo, space } from "../../../constants/theme";
import { EASE } from "../motion/easing";

/** Section tabs whose underline slides to the selected tab. Used by Tabs variant="underline". */
export default function UnderlineTabs({ options, value, onChange, tone = "light", stretch, style }) {
  const [layouts, setLayouts] = useState({});
  const x = useRef(new Animated.Value(0)).current;
  const w = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  const active = layouts[value];

  useEffect(() => {
    if (!active) return;
    // Width can't use the native driver, and one view can't mix drivers.
    const duration = reduced ? 0 : motion.base;
    Animated.parallel([
      Animated.timing(x, { toValue: active.x, duration, easing: EASE, useNativeDriver: false }),
      Animated.timing(w, { toValue: active.width, duration, easing: EASE, useNativeDriver: false }),
    ]).start();
  }, [active, x, w, reduced]);

  const dark = tone === "dark";
  const fg = dark ? colors.textInverse : colors.text;
  const muted = dark ? "rgba(255,255,255,0.88)" : colors.textMuted;

  return (
    <View style={[styles.row, stretch && styles.rowStretch, dark && styles.rowDark, style]} accessibilityRole="tablist">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <TouchableRipple
            key={String(o.value)}
            onPress={() => onChange(o.value)}
            onLayout={(e) => {
              const { x: lx, width } = e.nativeEvent.layout;
              setLayouts((prev) => ({ ...prev, [o.value]: { x: lx, width } }));
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            borderless
            style={[styles.tab, stretch && styles.tabStretch]}
          >
            <Text
              variant="bodyStrong"
              style={[dark && onVideo.text, { color: selected ? fg : muted, fontWeight: selected ? "800" : "600" }, stretch && styles.center]}
            >
              {o.badge !== undefined && o.badge !== null ? `${o.label} · ${o.badge}` : o.label}
            </Text>
          </TouchableRipple>
        );
      })}
      {active ? (
        <Animated.View style={[styles.underline, dark && styles.underlineDark, { backgroundColor: fg, width: w, transform: [{ translateX: x }] }]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: space.lg + 2, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  rowStretch: { gap: 0 },
  rowDark: { borderBottomColor: "transparent" },
  tab: { minHeight: 44, justifyContent: "center", paddingBottom: 6 },
  tabStretch: { flex: 1, alignItems: "center" },
  center: { textAlign: "center" },
  underline: { position: "absolute", left: 0, bottom: -1, height: 2, borderRadius: 1 },
  underlineDark: { shadowColor: "#000", shadowOpacity: 0.6, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
});
