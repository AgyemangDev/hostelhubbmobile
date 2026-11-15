import React, { useState } from "react";
import { View } from "react-native";
import { FadeIn, PillTabs } from "../ds";
import { colors, space } from "../../../constants/theme";

/**
 * Tabs with their content, using the push/unpush pill tabs. 2-3 tabs share
 * the width; more scroll sideways. Content fades in on switch.
 * tabs: [{ id, label, content }]
 */
export default function ReusableTabs({ tabs, initialTab }) {
  const [selected, setSelected] = useState(initialTab || tabs[0].id);
  const active = tabs.find((t) => t.id === selected);
  const options = tabs.map((t) => ({ value: t.id, label: t.label }));
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: space.lg, paddingTop: space.xs, paddingBottom: space.sm }}>
        <PillTabs options={options} value={selected} onChange={setSelected} scroll={tabs.length > 3} stretch={tabs.length <= 3} />
      </View>
      <FadeIn key={selected} style={{ flex: 1 }}>
        {active?.content}
      </FadeIn>
    </View>
  );
}
