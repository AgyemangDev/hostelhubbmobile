import React, { useEffect, useRef } from "react";
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, FadeIn, Notice, PriceBar, Timeline } from "../../../components/ui";
import useReducedMotion from "../../../hooks/useReducedMotion";
import { colors, space, type } from "../../../constants/theme";

// PriceBar pads the bottom inset itself; padding it here too doubled the gap on iOS.
const SCREEN_EDGES = ["top", "left", "right"];

/** After a clip is submitted: it isn't public until an admin accepts it. */
export default function Submitted() {
  const router = useRouter();
  const { name, room, school } = useLocalSearchParams();
  const scale = useRef(new Animated.Value(0.6)).current;
  const reduced = useReducedMotion();

  useEffect(() => {
    Animated.timing(scale, { toValue: 1, duration: reduced ? 0 : 420, easing: Easing.bezier(0.2, 0, 0, 1), useNativeDriver: true }).start();
  }, [scale, reduced]);

  return (
    <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Animated.View style={[styles.check, { transform: [{ scale }] }]}>
            <Ionicons name="checkmark" size={36} color={colors.onBrand} />
          </Animated.View>
          <Text style={[type.display, { textAlign: "center" }]} accessibilityRole="header">Your clip is in review</Text>
          <Text style={[type.body, { color: colors.textSecondary, textAlign: "center" }]}>
            We check the room and the video, usually within a day. You'll get a notification when it's live.
          </Text>
        </View>

        <FadeIn delay={120}>
          <Timeline
            steps={[
              { title: "Submitted", subtitle: [name, room].filter(Boolean).join(" · "), state: "done" },
              { title: "HostelHubb review", subtitle: "We may call the manager to confirm", state: "current" },
              { title: "Live in Hubclips", subtitle: school ? `Students near ${school} can reserve` : "Students can reserve", state: "todo" },
              { title: "Handover", subtitle: "We guide you and the new student", state: "todo" },
            ]}
          />
        </FadeIn>

        <Notice tone="info">If the price or availability changes, contact HostelHubb support and we'll update the clip.</Notice>
      </ScrollView>

      <PriceBar>
        <View style={{ flex: 1, flexDirection: "row", gap: space.sm }}>
          <Button title="Post another" variant="secondary" style={{ flex: 1 }} onPress={() => router.replace("/IntroductionScreen")} />
          <Button title="Back to Hubclips" style={{ flex: 1.3 }} onPress={() => router.replace("/(tabs)/(Hubclipps)")} />
        </View>
      </PriceBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, paddingTop: space.xxxl, gap: space.xl, paddingBottom: space.xxl },
  hero: { alignItems: "center", gap: space.sm },
  check: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center", marginBottom: space.xs },
});
