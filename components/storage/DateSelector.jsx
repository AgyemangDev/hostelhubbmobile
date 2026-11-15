import React, { useState } from "react";
import { Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { Button, PressableScale, Sheet } from "../ui/ds";
import { colors, space, type } from "../../constants/theme";

const iso = (d) => (d ? d.toISOString().split("T")[0] : undefined);
const pretty = (value) => {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-GH", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

/** A date field that opens a calendar sheet limited to the school's window. */
export default function DateSelector({ placeholder, value, minDate, maxDate, onChange, label }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value || null);
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={[type.caption, { fontWeight: "700" }]}>{label}</Text> : null}
      <PressableScale
        onPress={() => {
          setDraft(value || null);
          setOpen(true);
        }}
        accessibilityRole="button"
        accessibilityLabel={`${placeholder || "Date"}: ${pretty(value) || "not chosen"}`}
        style={{
          minHeight: 52,
          flexDirection: "row",
          alignItems: "center",
          gap: space.xs,
          paddingHorizontal: space.sm + 2,
          borderWidth: 1,
          borderColor: "#A8A29E",
          borderRadius: 12,
          backgroundColor: colors.surface,
        }}
      >
        <Ionicons name="calendar-outline" size={18} color={colors.text} />
        <Text style={[type.body, { flex: 1, color: value ? colors.text : colors.textMuted, fontWeight: value ? "600" : "500" }]}>
          {pretty(value) || placeholder || "Choose a date"}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.text} />
      </PressableScale>

      <Sheet
        visible={open}
        onClose={() => setOpen(false)}
        title={placeholder || "Choose a date"}
        footer={
          <Button
            title={draft ? `Use ${pretty(draft)}` : "Choose a date"}
            disabled={!draft}
            onPress={() => {
              onChange(draft);
              setOpen(false);
            }}
          />
        }
      >
        <Calendar
          current={iso(minDate)}
          minDate={iso(minDate)}
          maxDate={iso(maxDate)}
          onDayPress={(d) => setDraft(d.dateString)}
          hideExtraDays
          markedDates={draft ? { [draft]: { selected: true, selectedColor: colors.text } } : {}}
          theme={{
            todayTextColor: colors.brand,
            selectedDayBackgroundColor: colors.text,
            arrowColor: colors.text,
            textDayFontWeight: "600",
            textMonthFontWeight: "800",
            textDayHeaderFontWeight: "700",
            monthTextColor: colors.text,
            dayTextColor: colors.text,
            textDisabledColor: "#D6D3D1",
          }}
        />
        {minDate && maxDate ? (
          <Text style={[type.caption, { color: colors.textSecondary, marginTop: space.xs }]}>
            Available {pretty(iso(minDate))} to {pretty(iso(maxDate))}
          </Text>
        ) : null}
      </Sheet>
    </View>
  );
}
