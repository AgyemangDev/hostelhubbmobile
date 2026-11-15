// components/ui/ds.jsx
//
// HostelHubb design-system components, built on constants/theme.js and the
// boards on the design canvas (https://claude.ai/artifact/NcG2wGAM8Jhuosmr4MwgtA). Screens compose
// these instead of hand-styling buttons, sheets, tabs and footers.
//
// Motion rules: press = 120ms scale to 0.97, tabs/progress = 200ms,
// sheets = 280ms, one easing curve, no bounce, and everything is skipped
// when the OS "reduce motion" setting is on.
import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, elevation, minTouch, motion, onVideo, radius, space, type } from "../../constants/theme";

const EASE = Easing.bezier(0.2, 0, 0, 1);

// ── Motion helpers ──────────────────────────────────────────────────────────

/** True when the user asked the OS to reduce motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((v) => mounted && setReduced(Boolean(v)));
    const sub = AccessibilityInfo.addEventListener?.("reduceMotionChanged", (v) => setReduced(Boolean(v)));
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);
  return reduced;
}

const timing = (value, toValue, duration, reduced) =>
  Animated.timing(value, { toValue, duration: reduced ? 0 : duration, easing: EASE, useNativeDriver: true });

/** Pressable that dips to 97% while pressed. Use for every tappable surface. */
export function PressableScale({ children, style, disabled, onPressIn, onPressOut, ...props }) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  return (
    <Pressable
      disabled={disabled}
      onPressIn={(e) => {
        timing(scale, motion.pressScale, motion.fast, reduced).start();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        timing(scale, 1, motion.fast, reduced).start();
        onPressOut?.(e);
      }}
      {...props}
    >
      {(state) => (
        <Animated.View style={[{ transform: [{ scale }] }, typeof style === "function" ? style(state) : style]}>
          {typeof children === "function" ? children(state) : children}
        </Animated.View>
      )}
    </Pressable>
  );
}

/** Fades and lifts children in once, on mount. For screen content and list rows. */
export function FadeIn({ children, delay = 0, style }) {
  const v = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: reduced ? 0 : motion.base, delay: reduced ? 0 : delay, easing: EASE, useNativeDriver: true }).start();
  }, [v, delay, reduced]);
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });
  return <Animated.View style={[{ opacity: v, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
}

// ── Buttons ─────────────────────────────────────────────────────────────────

/** Primary = the one main action on a screen. Secondary = outline. Ghost = text. */
export function Button({ title, onPress, variant = "primary", loading, disabled, icon, style, accessibilityLabel, size = "lg" }) {
  const isDisabled = disabled || loading;
  const v = variants[variant] || variants.primary;
  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isDisabled, busy: Boolean(loading) }}
      style={[styles.button, size === "sm" && styles.buttonSm, v.container, isDisabled && styles.buttonDisabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={v.text.color} />
      ) : (
        <View style={styles.buttonContent}>
          {icon ? <Ionicons name={icon} size={18} color={v.text.color} /> : null}
          <Text style={[size === "sm" ? type.caption : type.bodyStrong, { fontWeight: "700" }, v.text]}>{title}</Text>
        </View>
      )}
    </PressableScale>
  );
}

const variants = {
  primary: { container: { backgroundColor: colors.brand }, text: { color: colors.onBrand } },
  secondary: { container: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.text }, text: { color: colors.text } },
  inverse: { container: { backgroundColor: colors.surface }, text: { color: colors.text } },
  ghost: { container: { backgroundColor: "transparent", paddingHorizontal: space.xs }, text: { color: colors.text, textDecorationLine: "underline" } },
};

export function IconButton({ icon, onPress, accessibilityLabel, color = colors.text, style, size = 22, iconStyle }) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      style={[styles.iconButton, style]}
    >
      <Ionicons name={icon} size={size} color={color} style={iconStyle} />
    </PressableScale>
  );
}

// ── Surfaces ────────────────────────────────────────────────────────────────

export function Card({ children, style, raised }) {
  return <View style={[styles.card, raised && elevation.card, style]}>{children}</View>;
}

export function Divider({ style }) {
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: colors.borderStrong }, style]} />;
}

/** Small uppercase label above a value ("PICKUP", "AVAILABLE BALANCE"). */
export function Eyebrow({ children, style }) {
  return <Text style={[type.label, { color: colors.textSecondary }, style]}>{children}</Text>;
}

/** Inline status message. tone: info | warning | danger | success */
export function Notice({ tone = "info", title, children, action, style }) {
  const t = tones[tone] || tones.info;
  return (
    <View style={[styles.notice, { backgroundColor: t.bg }, style]} accessibilityRole={tone === "danger" ? "alert" : undefined}>
      <Ionicons name={t.icon} size={20} color={t.fg} style={{ marginTop: 1 }} />
      <View style={{ flex: 1, gap: 2 }}>
        {title ? <Text style={[type.bodyStrong, { color: t.fg }]}>{title}</Text> : null}
        {children ? <Text style={[type.caption, { color: t.fg }]}>{children}</Text> : null}
        {action ? <View style={{ marginTop: space.xs }}>{action}</View> : null}
      </View>
    </View>
  );
}

const tones = {
  info: { bg: colors.fill, fg: colors.text, icon: "information-circle-outline" },
  warning: { bg: colors.warningBg, fg: colors.warningText, icon: "time-outline" },
  danger: { bg: colors.dangerBg, fg: colors.danger, icon: "alert-circle-outline" },
  success: { bg: colors.successBg, fg: colors.success, icon: "shield-checkmark-outline" },
};

/** Status pill. tone: neutral | warning | danger | success */
export function StatusPill({ label, tone = "neutral", style }) {
  const t = pillTones[tone] || pillTones.neutral;
  return (
    <View style={[styles.statusPill, { backgroundColor: t.bg }, style]}>
      <Text style={[type.label, { color: t.fg, letterSpacing: 0 }]}>{label}</Text>
    </View>
  );
}
const pillTones = {
  neutral: { bg: colors.fill, fg: colors.textSecondary },
  warning: { bg: colors.warningBg, fg: colors.warningText },
  danger: { bg: colors.dangerBg, fg: colors.danger },
  success: { bg: colors.successBg, fg: colors.success },
};

// ── Headers and footers ─────────────────────────────────────────────────────

const goBack = (router) => (router.canGoBack() ? router.back() : router.replace("/(tabs)/(index)"));

/** Screen title row with a back button. */
export function ScreenHeader({ title, subtitle, onBack, right, hideBack }) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      {hideBack ? (
        <View style={{ width: space.xs }} />
      ) : (
        <IconButton icon="chevron-back" accessibilityLabel="Go back" onPress={onBack || (() => goBack(router))} />
      )}
      <View style={{ flex: 1 }}>
        {title ? (
          <Text style={[type.heading, { color: colors.text }]} numberOfLines={1} accessibilityRole="header">
            {title}
          </Text>
        ) : null}
        {subtitle ? <Text style={[type.caption, { color: colors.textSecondary }]} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      <View style={styles.headerRight}>{right}</View>
    </View>
  );
}

/** Back button, "Step x of y", and a progress bar that grows between steps. */
export function StepHeader({ step, total, onBack, right }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(Math.max(0, (step - 1) / total))).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: step / total, duration: reduced ? 0 : motion.slow, easing: EASE, useNativeDriver: false }).start();
  }, [progress, step, total, reduced]);
  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  return (
    <View>
      <View style={styles.header}>
        <IconButton icon="chevron-back" accessibilityLabel="Go back" onPress={onBack || (() => goBack(router))} />
        <Text style={[type.caption, { flex: 1, fontWeight: "700", color: colors.textSecondary }]}>
          Step {step} of {total}
        </Text>
        <View style={styles.headerRight}>{right}</View>
      </View>
      <View
        style={styles.progressTrack}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: total, now: step }}
      >
        <Animated.View style={[styles.progressFill, { width }]} />
      </View>
    </View>
  );
}

/** Sticky bottom bar: total on the left, the screen's one action on the right. */
export function PriceBar({ amount, caption, action, children }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.priceBar, { paddingBottom: Math.max(insets.bottom, space.md) + 4 }]}>
      {amount !== undefined ? (
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[type.price, { color: colors.text }]}>{amount}</Text>
          {caption ? <Text style={[type.caption, { color: colors.textSecondary }]} numberOfLines={1}>{caption}</Text> : null}
        </View>
      ) : null}
      {action ? <View style={amount !== undefined ? null : { flex: 1 }}>{action}</View> : null}
      {children}
    </View>
  );
}

export const money = (n, { decimals = 2 } = {}) =>
  `GH₵ ${Number(n || 0).toLocaleString("en-GH", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

// ── Tabs ────────────────────────────────────────────────────────────────────

/**
 * Pill tabs that push and unpush, the standard tab control across the app.
 * Unselected pills sit raised on a soft shadow; the selected one looks
 * pressed in (sunken fill, no shadow). The press itself animates.
 *
 * options: [{ value, label, icon? }]
 * tone:    "light" (on white) | "dark" (over video or photos)
 * stretch: pills share the full width (for 2-3 choices in a form)
 * scroll:  scroll sideways when pills don't fit (headers, filters)
 */
export function PillTabs({ options, value, onChange, tone = "light", stretch, scroll, style, contentStyle }) {
  const pills = options.map((o) => (
    <Pill key={String(o.value)} option={o} selected={o.value === value} onPress={() => onChange(o.value)} tone={tone} stretch={stretch} />
  ));
  if (scroll) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.pillRow, styles.pillRowScroll, contentStyle]}
        style={style}
        accessibilityRole="tablist"
      >
        {pills}
      </ScrollView>
    );
  }
  return (
    <View style={[styles.pillRow, style]} accessibilityRole="tablist">
      {pills}
    </View>
  );
}

function Pill({ option, selected, onPress, tone, stretch }) {
  const dark = tone === "dark";
  const fg = dark ? (selected ? colors.text : colors.textInverse) : selected ? colors.textInverse : colors.text;
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={option.label}
      style={[
        styles.pill,
        stretch && { flex: 1 },
        dark
          ? selected
            ? styles.pillDarkOn
            : styles.pillDarkOff
          : selected
          ? styles.pillOn
          : styles.pillOff,
      ]}
    >
      {option.icon ? <Ionicons name={option.icon} size={18} color={fg} style={dark && !selected ? onVideo.text : null} /> : null}
      <Text
        style={[type.caption, { fontWeight: selected ? "800" : "700", color: fg }, dark && !selected && onVideo.text]}
        numberOfLines={1}
      >
        {option.label}
      </Text>
    </PressableScale>
  );
}

/** 2-3 choices across a form. Same push/unpush pills, sharing the width. */
export function Segmented({ options, value, onChange, style }) {
  return <PillTabs options={options} value={value} onChange={onChange} stretch style={style} />;
}

/** Underline tabs for sections of a page; the underline slides between tabs. */
export function UnderlineTabs({ options, value, onChange, tone = "light", style }) {
  const [layouts, setLayouts] = useState({});
  const x = useRef(new Animated.Value(0)).current;
  const w = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  const active = layouts[value];
  useEffect(() => {
    if (!active) return;
    // Width can't use the native driver, and one view can't mix native and JS
    // drivers, so both values animate on the JS driver.
    const duration = reduced ? 0 : motion.base;
    Animated.parallel([
      Animated.timing(x, { toValue: active.x, duration, easing: EASE, useNativeDriver: false }),
      Animated.timing(w, { toValue: active.width, duration, easing: EASE, useNativeDriver: false }),
    ]).start();
  }, [active, x, w, reduced]);
  const fg = tone === "dark" ? colors.textInverse : colors.text;
  const muted = tone === "dark" ? "rgba(255,255,255,0.88)" : colors.textMuted;
  return (
    <View style={[styles.underlineTabs, tone === "dark" && { borderBottomColor: "transparent" }, style]} accessibilityRole="tablist">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            onLayout={(e) => {
              const { x: lx, width } = e.nativeEvent.layout;
              setLayouts((prev) => ({ ...prev, [o.value]: { x: lx, width } }));
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={styles.underlineTab}
          >
            <Text style={[type.bodyStrong, tone === "dark" && onVideo.text, { color: selected ? fg : muted, fontWeight: selected ? "800" : "600" }]}>{o.label}</Text>
          </Pressable>
        );
      })}
      {active ? (
        <Animated.View
          style={[
            styles.underline,
            tone === "dark" && { shadowColor: "#000", shadowOpacity: 0.6, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
            { backgroundColor: fg, width: w, transform: [{ translateX: x }] },
          ]}
        />
      ) : null}
    </View>
  );
}

/** Selectable pill. Selected is ink, never green, so green always means "go". */
export function Chip({ label, selected, onPress, icon, accessibilityLabel, style }) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ selected: Boolean(selected) }}
      style={[styles.chip, selected && styles.chipSelected, style]}
    >
      {icon ? <Ionicons name={icon} size={16} color={selected ? colors.textInverse : colors.text} /> : null}
      <Text style={[type.caption, { fontWeight: "700", color: selected ? colors.textInverse : colors.text }]}>{label}</Text>
    </PressableScale>
  );
}

// ── Inputs ──────────────────────────────────────────────────────────────────

export function TextField({ label, hint, error, style, inputStyle, ...inputProps }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[{ gap: 6 }, style]}>
      {label ? <Text style={[type.caption, { color: colors.text, fontWeight: "700" }]}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={label}
        onFocus={(e) => {
          setFocused(true);
          inputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          inputProps.onBlur?.(e);
        }}
        {...inputProps}
        style={[styles.input, focused && styles.inputFocused, error && { borderColor: colors.danger }, inputStyle]}
      />
      {error ? (
        <Text style={[type.caption, { color: colors.danger }]}>{error}</Text>
      ) : hint ? (
        <Text style={[type.caption, { color: colors.textMuted }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

/** − 2 + quantity control. */
export function QuantityStepper({ value, onIncrease, onDecrease, label = "item", max }) {
  return (
    <View style={styles.stepper}>
      <PressableScale
        onPress={onDecrease}
        accessibilityRole="button"
        accessibilityLabel={`Remove one ${label}`}
        style={[styles.stepperBtn, { borderColor: colors.borderStrong }]}
      >
        <Ionicons name="remove" size={18} color={colors.text} />
      </PressableScale>
      <Text style={[type.bodyStrong, styles.stepperValue]} accessibilityLiveRegion="polite">{value}</Text>
      <PressableScale
        onPress={onIncrease}
        disabled={max !== undefined && value >= max}
        accessibilityRole="button"
        accessibilityLabel={`Add one ${label}`}
        style={[styles.stepperBtn, { borderColor: colors.text }, max !== undefined && value >= max && { opacity: 0.4 }]}
      >
        <Ionicons name="add" size={18} color={colors.text} />
      </PressableScale>
    </View>
  );
}

/** Row in a list: optional leading icon, title/subtitle, trailing content or chevron. */
export function ListRow({ title, subtitle, icon, leading, onPress, right, last, selected }) {
  const content = (
    <View style={[styles.listRow, !last && styles.listRowBorder]}>
      {leading ? leading : icon ? (
        <View style={styles.listIcon}>
          <Ionicons name={icon} size={20} color={colors.text} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type.body, { color: colors.text, fontWeight: "600" }]}>{title}</Text>
        {subtitle ? <Text style={[type.caption, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
      </View>
      {right !== undefined ? (
        right
      ) : selected !== undefined ? (
        <View style={[styles.radio, selected && styles.radioOn]}>{selected ? <View style={styles.radioDot} /> : null}</View>
      ) : onPress ? (
        <Ionicons name="chevron-forward" size={18} color={colors.text} />
      ) : null}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={selected !== undefined ? "radio" : "button"}
      accessibilityState={selected !== undefined ? { selected } : undefined}
      style={({ pressed }) => pressed && { backgroundColor: colors.fill }}
    >
      {content}
    </Pressable>
  );
}

// ── Progress ────────────────────────────────────────────────────────────────

/**
 * Vertical step line used by every booking (room, storage, bus).
 * steps: [{ title, subtitle, state: 'done' | 'current' | 'todo' }]
 */
export function Timeline({ steps }) {
  return (
    <View accessibilityRole="list">
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const next = steps[i + 1];
        return (
          <View key={s.title} style={{ flexDirection: "row", gap: space.sm + 2 }} accessibilityLabel={`${s.title}, ${s.state === "done" ? "done" : s.state === "current" ? "next step" : "not yet"}`}>
            <View style={{ alignItems: "center" }}>
              {s.state === "done" ? (
                <View style={[styles.dot, { backgroundColor: colors.brand }]}>
                  <Ionicons name="checkmark" size={13} color={colors.onBrand} />
                </View>
              ) : (
                <View style={[styles.dot, { borderWidth: s.state === "current" ? 3 : 2, borderColor: s.state === "current" ? colors.text : "#A8A29E" }]} />
              )}
              {!last ? (
                <View style={{ width: 2, flex: 1, minHeight: 28, backgroundColor: s.state === "done" && next?.state === "done" ? colors.brand : colors.borderStrong }} />
              ) : null}
            </View>
            <View style={{ flex: 1, gap: 2, paddingBottom: last ? 0 : space.md }}>
              <Text style={[type.bodyStrong, { color: s.state === "todo" ? colors.textSecondary : colors.text, fontWeight: s.state === "current" ? "800" : "700" }]}>{s.title}</Text>
              {s.subtitle ? <Text style={[type.caption, { color: colors.textSecondary }]}>{s.subtitle}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ── Bottom sheet ────────────────────────────────────────────────────────────

/**
 * Every picker, filter and confirmation is a sheet from the bottom.
 * Slides up in 280ms over a dimmed backdrop; closes on backdrop tap, the
 * Android back button, or dragging the handle down.
 */
export function Sheet({ visible, onClose, title, children, footer, dark }) {
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
  const bg = dark ? "#1C1917" : colors.surface;
  const fg = dark ? colors.textInverse : colors.text;

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
          <View {...pan.panHandlers} style={styles.sheetHandleArea}>
            <View style={[styles.sheetHandle, dark && { backgroundColor: "#57534E" }]} />
          </View>
          {title ? (
            <View style={styles.sheetTitleRow}>
              <Text style={[type.title, { color: fg, flex: 1 }]} accessibilityRole="header">{title}</Text>
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

/** Centred empty or error state with one optional action. */
export function EmptyState({ icon = "file-tray-outline", title, body, action }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={26} color={colors.text} />
      </View>
      <Text style={[type.heading, { textAlign: "center" }]}>{title}</Text>
      {body ? <Text style={[type.body, { color: colors.textSecondary, textAlign: "center" }]}>{body}</Text> : null}
      {action ? <View style={{ alignSelf: "stretch", marginTop: space.xs }}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: radius.md, paddingHorizontal: space.lg, alignItems: "center", justifyContent: "center" },
  buttonSm: { minHeight: 44, paddingHorizontal: space.md, borderRadius: 10 },
  buttonContent: { flexDirection: "row", alignItems: "center", gap: space.xs },
  buttonDisabled: { opacity: 0.4 },
  iconButton: { width: minTouch, height: minTouch, alignItems: "center", justifyContent: "center", borderRadius: radius.pill },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: space.md },
  notice: { flexDirection: "row", gap: space.sm, padding: space.sm + 2, borderRadius: radius.md },
  statusPill: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: space.xs, paddingVertical: space.xxs, gap: space.xxs, minHeight: 52 },
  headerRight: { minWidth: minTouch, alignItems: "flex-end", paddingRight: space.xs },
  progressTrack: { height: 4, borderRadius: 2, backgroundColor: colors.border, marginHorizontal: space.lg, overflow: "hidden" },
  progressFill: { height: 4, borderRadius: 2, backgroundColor: colors.text },
  priceBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingTop: space.sm + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  pillRow: { flexDirection: "row", gap: space.xs, alignItems: "center" },
  // Room for the raised pills' shadows inside the horizontal scroller.
  pillRowScroll: { paddingVertical: 6, paddingHorizontal: 2 },
  pill: {
    minHeight: 44,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  // Raised: white with a soft shadow.
  pillOff: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    shadowColor: "#1C1917",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  // Pushed in: solid ink fill, no lift. Unpushed is the raised white pill.
  pillOn: { backgroundColor: colors.text, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.text, elevation: 0, shadowOpacity: 0 },
  pillDarkOff: { backgroundColor: "rgba(0,0,0,0.32)", borderWidth: 1, borderColor: "rgba(255,255,255,0.55)" },
  pillDarkOn: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#FFFFFF" },
  segmented: { flexDirection: "row", backgroundColor: colors.fill, borderRadius: radius.md, padding: 4 },
  segmentThumb: { position: "absolute", top: 4, bottom: 4, left: 4, borderRadius: radius.sm, backgroundColor: colors.surface, ...elevation.card, shadowOpacity: 0.07 },
  segment: { flex: 1, minHeight: 40, alignItems: "center", justifyContent: "center" },
  underlineTabs: { flexDirection: "row", gap: space.lg + 2, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  underlineTab: { minHeight: 44, justifyContent: "center", paddingBottom: 6 },
  underline: { position: "absolute", left: 0, bottom: -1, height: 2, borderRadius: 1 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 40,
    paddingHorizontal: space.sm + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.text, borderColor: colors.text },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#A8A29E",
    borderRadius: radius.md,
    paddingHorizontal: space.sm + 2,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  selectField: { flexDirection: "row", alignItems: "center", gap: space.xs },
  inputFocused: { borderWidth: 2, borderColor: colors.text, paddingHorizontal: space.sm + 1 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 4 },
  stepperBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  stepperValue: { minWidth: 28, textAlign: "center", fontWeight: "800" },
  listRow: { flexDirection: "row", alignItems: "center", gap: space.sm, minHeight: 56, paddingVertical: space.sm },
  listRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  listIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.fill, alignItems: "center", justifyContent: "center" },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#A8A29E", alignItems: "center", justifyContent: "center" },
  radioOn: { borderColor: colors.text },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.text },
  dot: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
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
  sheetHandleArea: { alignItems: "center", paddingTop: 10, paddingBottom: space.sm, marginHorizontal: -space.lg },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong },
  sheetTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: space.xs, marginRight: -space.xs },
  empty: { alignItems: "center", gap: space.xs, padding: space.xl },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.fill, alignItems: "center", justifyContent: "center", marginBottom: space.xs },
});

// ── Select field ────────────────────────────────────────────────────────────

/**
 * Looks like a text field; tapping opens a bottom sheet of options.
 * options: string[] or [{ value, label, subtitle }]
 */
export function SelectField({ label, value, placeholder = "Choose", options = [], onChange, sheetTitle, disabled, error }) {
  const [open, setOpen] = useState(false);
  const items = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const current = items.find((o) => o.value === value);
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={[type.caption, { color: colors.text, fontWeight: "700" }]}>{label}</Text> : null}
      <PressableScale
        onPress={() => setOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${label || sheetTitle || "Select"}: ${current ? current.label : placeholder}`}
        style={[styles.input, styles.selectField, error && { borderColor: colors.danger }, disabled && { opacity: 0.5 }]}
      >
        <Text style={[type.body, { flex: 1, color: current ? colors.text : colors.textMuted, fontWeight: current ? "600" : "500" }]} numberOfLines={1}>
          {current ? current.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.text} />
      </PressableScale>
      {error ? <Text style={[type.caption, { color: colors.danger }]}>{error}</Text> : null}
      <Sheet visible={open} onClose={() => setOpen(false)} title={sheetTitle || label}>
        <ScrollViewLite>
          {items.length === 0 ? (
            <Text style={[type.body, { color: colors.textSecondary, paddingVertical: space.md }]}>Nothing to choose yet.</Text>
          ) : (
            items.map((o, i) => (
              <ListRow
                key={String(o.value)}
                title={o.label}
                subtitle={o.subtitle}
                selected={o.value === value}
                last={i === items.length - 1}
                onPress={() => {
                  onChange?.(o.value);
                  setOpen(false);
                }}
              />
            ))
          )}
        </ScrollViewLite>
      </Sheet>
    </View>
  );
}

// Lets the sheet body scroll when a list is long.
function ScrollViewLite({ children }) {
  return (
    <ScrollView style={{ maxHeight: 460 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}
