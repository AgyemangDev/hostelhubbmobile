import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Tabs from "./Tabs";
import FadeIn from "../motion/FadeIn";
import { colors, space } from "../../../constants/theme";

/**
 * Tabs plus the content for each, for whole screens split into sections
 * (Bookings: Rooms / Storage / Buses). 2-3 tabs share the width; more scroll
 * sideways. Content fades in on switch.
 *
 * tabs:    [{ id, label, content }]
 * variant: any Tabs variant (pill by default)
 */
export default function TabPanels({ tabs, initialTab, variant = "pill" }) {
  const [selected, setSelected] = useState(initialTab || tabs[0].id);
  const active = tabs.find((t) => t.id === selected);
  const options = tabs.map((t) => ({ value: t.id, label: t.label }));
  return (
    <View style={styles.screen}>
      <View style={styles.bar}>
        <Tabs variant={variant} options={options} value={selected} onChange={setSelected} scroll={tabs.length > 3} stretch={tabs.length <= 3} />
      </View>
      <FadeIn key={selected} style={styles.screen}>
        {active?.content}
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  bar: { paddingHorizontal: space.lg, paddingTop: space.xs, paddingBottom: space.sm },
});
