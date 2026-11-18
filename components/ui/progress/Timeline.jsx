import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-paper";
import Text from "../typography/Text";
import { colors, space } from "../../../constants/theme";

const stateLabel = { done: "done", current: "next step", todo: "not yet" };

/**
 * Vertical step line.
 *
 * variant: status (default) — progress of a booking (room, storage, bus);
 *            steps: [{ title, subtitle, state: 'done' | 'current' | 'todo' }]
 *          guide — how a process works, every step equal; each dot shows
 *            the step's Ionicons `icon`, or its number
 */
export default function Timeline({ steps, variant = "status" }) {
  const guide = variant === "guide";
  return (
    <View accessibilityRole="list">
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const next = steps[i + 1];
        const label = guide ? `Step ${i + 1}, ${s.title}` : `${s.title}, ${stateLabel[s.state] || "not yet"}`;
        return (
          <View key={s.title} style={styles.row} accessibilityLabel={label}>
            <View style={styles.rail}>
              {guide ? (
                <View style={[styles.dot, styles.dotGuide]}>
                  {s.icon ? <Icon source={s.icon} size={13} color={colors.brand} /> : <Text variant="label" tone="brand">{i + 1}</Text>}
                </View>
              ) : s.state === "done" ? (
                <View style={[styles.dot, { backgroundColor: colors.brand }]}>
                  <Icon source="checkmark" size={13} color={colors.onBrand} />
                </View>
              ) : (
                <View style={[styles.dot, s.state === "current" ? styles.dotCurrent : styles.dotTodo]} />
              )}
              {!last ? (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: guide ? colors.brandSoft : s.state === "done" && next?.state === "done" ? colors.brand : colors.borderStrong },
                  ]}
                />
              ) : null}
            </View>
            <View style={[styles.text, { paddingBottom: last ? 0 : space.md }]}>
              <Text
                variant="bodyStrong"
                tone={!guide && s.state === "todo" ? "secondary" : "default"}
                style={{ fontWeight: !guide && s.state === "current" ? "800" : "700" }}
              >
                {s.title}
              </Text>
              {s.subtitle ? <Text variant="caption" tone="secondary">{s.subtitle}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: space.sm + 2 },
  rail: { alignItems: "center" },
  dot: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  dotCurrent: { borderWidth: 3, borderColor: colors.text },
  dotTodo: { borderWidth: 2, borderColor: "#A8A29E" },
  dotGuide: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.brandSoft },
  line: { width: 2, flex: 1, minHeight: 20 },
  text: { flex: 1, gap: 2, paddingTop: 2 },
});
