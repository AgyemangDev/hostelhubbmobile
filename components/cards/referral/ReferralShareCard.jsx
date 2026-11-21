// components/cards/referral/ReferralShareCard.jsx
//
// The profile's "invite friends" card: the student's code on a ticket-style
// stub with Copy and Share side by side (Share opens the system sheet, which
// includes WhatsApp and Messages), and what it earns.
import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Pressable, StyleSheet, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Icon, PressableScale, Text } from "../../ui";
import { shareReferral } from "../../../utils/referralShare";
import { colors, radius, space } from "../../../constants/theme";

export default function ReferralShareCard({ code, onLearnMore }) {
  const hasCode = Boolean(code && code !== "—");
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef(null);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copy = async () => {
    if (!hasCode) return;
    await Clipboard.setStringAsync(code);
    AccessibilityInfo.announceForAccessibility?.("Referral code copied");
    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="caption" style={styles.eyebrow}>INVITE FRIENDS · EARN</Text>
          <Text style={styles.title}>Earn 5% every time a friend pays with your code</Text>
        </View>
        <View style={styles.badge}>
          <Icon name="gift-outline" size={22} color={colors.brand} />
        </View>
      </View>

      <View style={styles.stub}>
        <Text variant="caption" style={styles.stubLabel}>YOUR CODE</Text>
        <Text
          selectable
          style={styles.code}
          accessibilityLabel={hasCode ? `Your referral code, ${code.split("").join(" ")}` : "Referral code not ready yet"}
        >
          {hasCode ? code : "—"}
        </Text>
        {hasCode ? (
          <View style={styles.buttons}>
            <PressableScale
              onPress={copy}
              accessibilityRole="button"
              accessibilityLabel={copied ? "Code copied" : "Copy code"}
              style={[styles.pill, copied && styles.pillDone]}
            >
              <Icon name={copied ? "checkmark" : "copy-outline"} size={16} color={copied ? colors.textInverse : colors.brand} />
              <Text variant="caption" style={[styles.pillText, copied && { color: colors.textInverse }]}>
                {copied ? "Copied" : "Copy code"}
              </Text>
            </PressableScale>
            <PressableScale onPress={() => shareReferral(code)} accessibilityRole="button" accessibilityLabel="Share your code" style={styles.pill}>
              <Icon name="share-social-outline" size={16} color={colors.brand} />
              <Text variant="caption" style={styles.pillText}>Share</Text>
            </PressableScale>
          </View>
        ) : null}
      </View>

      {onLearnMore ? (
        <Pressable onPress={onLearnMore} accessibilityRole="link" hitSlop={8} style={styles.learn}>
          <Text variant="caption" style={styles.learnText}>How referrals work</Text>
          <Icon name="chevron-forward" size={14} color="rgba(255,255,255,0.85)" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.brand, borderRadius: radius.xl, padding: space.lg, gap: space.md },
  head: { flexDirection: "row", alignItems: "flex-start", gap: space.md },
  eyebrow: { color: "rgba(255,255,255,0.7)", fontWeight: "800", letterSpacing: 1.1 },
  title: { color: colors.textInverse, fontSize: 18, lineHeight: 23, fontWeight: "800" },
  badge: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  stub: {
    alignItems: "center",
    gap: 2,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  stubLabel: { color: "rgba(255,255,255,0.65)", fontWeight: "700", letterSpacing: 1.2, fontSize: 11 },
  code: { color: colors.textInverse, fontSize: 28, lineHeight: 34, fontWeight: "800", letterSpacing: 5 },
  buttons: { flexDirection: "row", gap: space.sm, marginTop: space.xs },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    minHeight: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  pillDone: { backgroundColor: "rgba(255,255,255,0.22)" },
  pillText: { color: colors.brand, fontWeight: "800" },
  learn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 2 },
  learnText: { color: "rgba(255,255,255,0.85)", fontWeight: "700" },
});
