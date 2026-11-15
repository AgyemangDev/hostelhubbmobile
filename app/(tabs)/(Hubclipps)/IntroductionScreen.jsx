import React, { useState } from "react";
import { Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Button, Eyebrow, FadeIn, IconButton, PriceBar } from "../../../components/ui/ds";
import { colors, radius, space, type } from "../../../constants/theme";

const TERMS_URL = "https://hostelhubb.com/terms/hubclipps";

const REASONS = [
  { icon: "people-outline", title: "Seen by verified students", body: "Shown to students at your school who are looking right now." },
  { icon: "shield-checkmark-outline", title: "Checked before it goes live", body: "Our team reviews every clip, usually within a day." },
  { icon: "swap-horizontal-outline", title: "We guide the handover", body: "From the first request to keys changing hands." },
];

export default function IntroductionScreen() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.top}>
        <IconButton icon="close" accessibilityLabel="Close" onPress={() => router.back()} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <FadeIn style={{ gap: space.xs }}>
          <Eyebrow>HUBCLIPS · POST A ROOM</Eyebrow>
          <Text style={styles.title} accessibilityRole="header">Moving out? Find the next student for your room.</Text>
          <Text style={[type.body, { color: colors.textSecondary }]}>
            Post a short video tour. Students near your campus book through HostelHubb, and we handle the rest.
          </Text>
        </FadeIn>

        <FadeIn delay={80} style={{ gap: space.lg }}>
          {REASONS.map((r) => (
            <View key={r.title} style={styles.reason}>
              <View style={styles.reasonIcon}>
                <Ionicons name={r.icon} size={20} color={colors.text} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={type.bodyStrong}>{r.title}</Text>
                <Text style={[type.caption, { color: colors.textSecondary }]}>{r.body}</Text>
              </View>
            </View>
          ))}
        </FadeIn>
      </ScrollView>

      <PriceBar>
        <View style={{ flex: 1, gap: space.sm }}>
          <Pressable
            onPress={() => setAgreed((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: agreed }}
            style={styles.agree}
          >
            <View style={[styles.box, agreed && styles.boxOn]}>
              {agreed ? <Ionicons name="checkmark" size={14} color={colors.textInverse} /> : null}
            </View>
            <Text style={[type.caption, { flex: 1, color: colors.text }]}>
              I have the right to offer this room and agree to the{" "}
              <Text style={{ fontWeight: "700", textDecorationLine: "underline" }} onPress={() => Linking.openURL(TERMS_URL)}>
                Hubclips listing terms
              </Text>
              .
            </Text>
          </Pressable>
          <Button title="Get started" disabled={!agreed} onPress={() => router.push("/AccommodationInfoScreen")} />
        </View>
      </PriceBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  top: { paddingHorizontal: space.xs, paddingTop: space.xxs },
  scroll: { padding: space.lg, paddingTop: space.xs, gap: space.xxl, paddingBottom: space.xxl },
  title: { fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.5, color: colors.text },
  reason: { flexDirection: "row", gap: space.sm + 2, alignItems: "flex-start" },
  reasonIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.fill, alignItems: "center", justifyContent: "center" },
  agree: { flexDirection: "row", gap: space.sm, alignItems: "flex-start", minHeight: 44 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: "#A8A29E", alignItems: "center", justifyContent: "center", marginTop: 1 },
  boxOn: { backgroundColor: colors.text, borderColor: colors.text },
});
