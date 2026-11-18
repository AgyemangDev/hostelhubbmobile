// components/forms/profile/DateOfBirthField.jsx
//
// Date of birth input. iOS: a spinner wheel in a bottom sheet with a Done
// button. Android: the system date dialog. Values in and out are
// "YYYY-MM-DD" strings (built from local date parts, so no timezone shift).
//
// locked: read-only display with a lock, for after it's been saved — the
//         backend and database refuse changes once a date of birth is set.
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Button, Icon, PressableScale, Sheet, Text } from "../../ui";
import { FieldHelp, FieldLabel } from "../../ui/inputs/FieldLabel";
import { colors, radius, space } from "../../../constants/theme";

export const MIN_AGE = 13;

const pad = (n) => String(n).padStart(2, "0");
export const toIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromIso = (s) => {
  const m = typeof s === "string" && s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
};
export const formatDob = (s) =>
  fromIso(s)?.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) ?? null;

const yearsAgo = (n) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - n);
  return d;
};

export default function DateOfBirthField({ value, onChange, locked, error, label = "Date of birth", hint }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const maximumDate = yearsAgo(MIN_AGE);
  const minimumDate = new Date(1920, 0, 1);
  const current = fromIso(value);
  const start = current || yearsAgo(18);
  const pretty = formatDob(value);

  const openPicker = () => {
    if (locked) return;
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: start,
        mode: "date",
        maximumDate,
        minimumDate,
        onChange: (event, date) => {
          if (event.type === "set" && date) onChange?.(toIso(date));
        },
      });
      return;
    }
    setDraft(start);
    setOpen(true);
  };

  const field = (
    <View style={[styles.field, error && styles.fieldError, locked && styles.fieldLocked]}>
      <Icon name="calendar-outline" size={18} tone={locked ? "secondary" : "default"} />
      <Text style={[styles.value, !pretty && { color: colors.textMuted, fontWeight: "500" }, locked && { color: colors.textSecondary }]}>
        {pretty || "Choose your date of birth"}
      </Text>
      <Icon name={locked ? "lock-closed" : "chevron-down"} size={16} tone="secondary" />
    </View>
  );

  return (
    <View style={styles.wrap}>
      <FieldLabel>{label}</FieldLabel>
      {locked ? (
        <View accessible accessibilityLabel={`${label}: ${pretty || "not set"}. Locked, can't be changed.`}>{field}</View>
      ) : (
        <PressableScale onPress={openPicker} accessibilityRole="button" accessibilityLabel={`${label}: ${pretty || "not chosen"}`}>
          {field}
        </PressableScale>
      )}
      <FieldHelp error={typeof error === "string" ? error : null} hint={hint} />

      {Platform.OS === "ios" ? (
        <Sheet
          visible={open}
          onClose={() => setOpen(false)}
          title={label}
          footer={
            <Button
              title="Done"
              onPress={() => {
                if (draft) onChange?.(toIso(draft));
                setOpen(false);
              }}
            />
          }
        >
          {draft ? (
            <DateTimePicker
              value={draft}
              mode="date"
              display="spinner"
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              onChange={(_e, d) => d && setDraft(d)}
              themeVariant="light"
              style={{ alignSelf: "stretch" }}
            />
          ) : null}
        </Sheet>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  field: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingHorizontal: space.sm + 2,
    borderWidth: 1,
    borderColor: "#A8A29E",
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  fieldError: { borderColor: colors.danger },
  fieldLocked: { backgroundColor: colors.fill, borderColor: colors.border },
  value: { flex: 1, fontSize: 16, fontWeight: "600", color: colors.text },
});
