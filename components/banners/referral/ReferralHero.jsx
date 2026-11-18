import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Eyebrow, Notice, StatCard, StatusPill, Text } from "../../ui";
import { colors, space } from "../../../constants/theme";

/** Top of the referral screen: your code, what it does, your stats, and Share. */
export default function ReferralHero({ referralCode, hostsCount, totalBookings, total, onShare }) {
  return (
    <View>
      <View style={styles.header}>
        <View style={styles.top}>
          <View style={{ gap: 4 }}>
            <Eyebrow style={styles.label}>YOUR REFERRAL CODE</Eyebrow>
            <Text variant="display" tone="inverse" style={styles.code}>{referralCode || "—"}</Text>
          </View>
          <StatusPill label="Active" tone="dark" />
        </View>

        <Text variant="caption" style={styles.tagline}>
          Refer a host for an ongoing cut of their bookings, or share your code for anyone to use on an accommodation, hubclip, or storage booking.
        </Text>

        <View style={styles.stats}>
          <StatCard tone="onBrand" icon="people-outline" label="Hosts referred" value={hostsCount} />
          <StatCard tone="onBrand" icon="bag-outline" label="Paid bookings" value={totalBookings} />
          <StatCard tone="highlight" icon="trending-up" label="GHS earned" value={Number(total).toFixed(0)} />
        </View>
      </View>

      <Notice tone="success" icon="flash-outline" style={styles.hint}>
        One hostel referral can pay you continuously. A host with just 10 bookings could put over GHS 600 in your pocket — with even more as bookings grow.
      </Notice>

      <Button title="Share my code" icon="share-social-outline" onPress={onShare} style={styles.share} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.brand, padding: space.xl, paddingTop: 36, paddingBottom: 28, gap: space.md },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  label: { color: "rgba(255,255,255,0.6)", letterSpacing: 1.2 },
  code: { letterSpacing: 4 },
  tagline: { color: "rgba(255,255,255,0.8)", lineHeight: 19 },
  stats: { flexDirection: "row", gap: space.xs },
  hint: { borderRadius: 0 },
  share: { margin: space.md, marginTop: 14 },
});
