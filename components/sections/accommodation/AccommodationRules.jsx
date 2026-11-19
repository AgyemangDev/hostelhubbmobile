import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Icon, Section, Text } from "../../ui";
import { colors, radius, space } from "../../../constants/theme";
import { defaultHouseRulesFor } from "../../../constants/defaultHouseRules";

// Older listings only have yes/no rules; these turn them into sentences.
const RULE_LABELS = [
  ["visitors_allowed", "Visitors are allowed"],
  ["cooking_allowed", "Cooking is allowed"],
  ["student_id_required", "Student ID is required"],
  ["internet_available", "Internet is available"],
  ["water_available", "Water is available"],
  ["laundry_available", "Laundry is available"],
  ["caretaker_available", "Caretaker is available"],
  ["early_arrival_policy", "Early arrival arrangements are available"],
  ["late_departure_policy", "Late departure arrangements are available"],
  ["pets_not_allowed", "Pets are not allowed"],
  ["alcohol_not_allowed", "Alcohol is not allowed"],
  ["smoking_not_allowed", "Smoking is not allowed"],
];

const SHOWN = 5;

const normalizeRules = (rules) => {
  if (!rules || typeof rules !== "object") return {};
  const n = { ...rules };
  if (n.visitors_allowed === undefined && n.overnight_visitors_allowed !== undefined) n.visitors_allowed = n.overnight_visitors_allowed;
  if (n.cooking_allowed === undefined && n.cooking_in_rooms_not_allowed !== undefined) n.cooking_allowed = !n.cooking_in_rooms_not_allowed;
  if (n.early_arrival_policy === undefined && n.early_arrival_allowed !== undefined) n.early_arrival_policy = n.early_arrival_allowed;
  if (n.late_departure_policy === undefined && n.late_departure_allowed !== undefined) n.late_departure_policy = n.late_departure_allowed;
  return n;
};

/**
 * The hostel's house rules as numbered points (accommodation_rules.house_rules,
 * written by the owner), or the older yes/no rules for listings that have
 * no points yet. Students accept these in their tenancy agreement.
 */
export default function AccommodationRules({ rules = {}, category }) {
  const [expanded, setExpanded] = useState(false);
  const r = normalizeRules(rules);
  const own = Array.isArray(r.house_rules) && r.house_rules.length
    ? r.house_rules.filter(Boolean)
    : RULE_LABELS.filter(([key]) => r[key] === true).map(([, label]) => label);
  // No rules from the owner yet: show the standard ones for this kind of place.
  const isDefault = own.length === 0;
  const points = isDefault ? defaultHouseRulesFor(category) : own;
  const visible = expanded ? points : points.slice(0, SHOWN);

  return (
    <Section
      title="House rules"
      style={styles.section}
      subtitle={isDefault ? "Standard HostelHubb rules for this kind of place. The hostel may add its own." : "You agree to these before you pay."}
    >
      {points.length ? (
        <View style={styles.list}>
          {visible.map((text, i) => (
            <View key={`${i}-${text}`} style={styles.row}>
              <View style={styles.num}><Text variant="label" tone="brand">{i + 1}</Text></View>
              <Text style={styles.text}>{text}</Text>
            </View>
          ))}
          {points.length > SHOWN ? (
            <Button
              title={expanded ? "Show fewer" : `Show all ${points.length} rules`}
              variant="ghost"
              size="sm"
              icon={expanded ? "chevron-up" : "chevron-down"}
              iconPosition="right"
              onPress={() => setExpanded((v) => !v)}
              style={styles.more}
            />
          ) : null}
        </View>
      ) : (
        <View style={styles.empty}>
          <Icon name="document-text-outline" size={20} tone="secondary" />
          <Text tone="secondary" style={styles.text}>The manager hasn't added house rules yet.</Text>
        </View>
      )}
    </Section>
  );
}

const styles = StyleSheet.create({
  section: { marginVertical: space.lg },
  list: { gap: space.sm },
  row: { flexDirection: "row", alignItems: "flex-start", gap: space.sm },
  num: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.brandSoft, alignItems: "center", justifyContent: "center", marginTop: 1 },
  text: { flex: 1 },
  more: { alignSelf: "flex-start" },
  empty: { flexDirection: "row", gap: space.sm, alignItems: "center", padding: space.sm, borderRadius: radius.md, backgroundColor: colors.fill },
});
