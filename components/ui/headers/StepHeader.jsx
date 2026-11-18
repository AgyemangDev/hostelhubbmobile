import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { ProgressBar } from "react-native-paper";
import IconButton from "../buttons/IconButton";
import Text from "../typography/Text";
import { colors, minTouch, space } from "../../../constants/theme";
import { goBack } from "./goBack";

/** Back button, "Step x of y", and Paper's progress bar, which animates between steps. */
export default function StepHeader({ step, total, onBack, right }) {
  const router = useRouter();
  return (
    <View>
      <View style={styles.header}>
        <IconButton icon="chevron-back" accessibilityLabel="Go back" onPress={onBack || (() => goBack(router))} />
        <Text variant="caption" tone="secondary" style={styles.step}>
          Step {step} of {total}
        </Text>
        <View style={styles.right}>{right}</View>
      </View>
      <View style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: step }}>
        <ProgressBar progress={total ? step / total : 0} color={colors.text} style={styles.bar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: space.xs, paddingVertical: space.xxs, gap: space.xxs, minHeight: 52 },
  step: { flex: 1, fontWeight: "700" },
  right: { minWidth: minTouch, alignItems: "flex-end", paddingRight: space.xs },
  track: { marginHorizontal: space.lg, borderRadius: 2, overflow: "hidden" },
  bar: { height: 4, borderRadius: 2, backgroundColor: colors.border },
});
