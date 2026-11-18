import React, { useEffect, useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Modal, PanResponder, Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IconButton from "../buttons/IconButton";
import Text from "../typography/Text";
import useReducedMotion from "../../../hooks/useReducedMotion";
import { colors, elevation, motion, radius, space } from "../../../constants/theme";
import { EASE, timing } from "../motion/easing";

/**
 * Bottom sheet for every picker, filter and confirmation. Paper has no
 * bottom sheet, so this one is ours: slides up over a dimmed backdrop and
 * closes on backdrop tap, the Android back button, or dragging the handle.
 *
 * variant: light (default) | dark (over video)
 */
export default function Sheet({ visible, onClose, title, children, footer, variant = "light", dark }) {
  const isDark = dark || variant === "dark";
  const [mounted, setMounted] = useState(visible);
  const y = useRef(new Animated.Value(1)).current; // 0 = open, 1 = closed
  const drag = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      setMounted(true);
      drag.setValue(0);
      timing(y, 0, motion.slow, reduced).start();
    } else if (mounted) {
      timing(y, 1, motion.base, reduced).start(({ finished }) => finished && setMounted(false));
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 6,
      onPanResponderMove: (_, g) => drag.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 100 || g.vy > 0.8) onClose?.();
        else Animated.timing(drag, { toValue: 0, duration: motion.base, easing: EASE, useNativeDriver: true }).start();
      },
    })
  ).current;

  if (!mounted) return null;
  const translateY = Animated.add(y.interpolate({ inputRange: [0, 1], outputRange: [0, 700] }), drag);
  const backdrop = y.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const bg = isDark ? "#1C1917" : colors.surface;
  const fg = isDark ? colors.textInverse : colors.text;

  return (
    <Modal transparent visible statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdrop }]}>
          <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" />
        </Animated.View>
        <Animated.View
          style={[styles.sheet, { backgroundColor: bg, paddingBottom: Math.max(insets.bottom, space.md) + 4, transform: [{ translateY }] }]}
          accessibilityViewIsModal
        >
          <View {...pan.panHandlers} style={styles.handleArea}>
            <View style={[styles.handle, isDark && { backgroundColor: "#57534E" }]} />
          </View>
          {title ? (
            <View style={styles.titleRow}>
              <Text variant="title" style={{ color: fg, flex: 1 }} accessibilityRole="header">
                {title}
              </Text>
              <IconButton icon="close" accessibilityLabel="Close" onPress={onClose} color={fg} />
            </View>
          ) : null}
          <View style={{ flexShrink: 1 }}>{children}</View>
          {footer ? <View style={{ paddingTop: space.md }}>{footer}</View> : null}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: "rgba(12,10,9,0.45)" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "88%",
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: space.lg,
    ...elevation.floating,
  },
  handleArea: { alignItems: "center", paddingTop: 10, paddingBottom: space.sm, marginHorizontal: -space.lg },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: space.xs, marginRight: -space.xs },
});
