import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Card, Eyebrow, FeatureCard, Section, Tabs, Text } from "../../../components/ui";
import ServiceGuide from "../../../components/sections/guide/ServiceGuide";
import { HOW_IT_WORKS_HERO, PROMISE, SERVICES, WAYS_TO_EARN } from "../../../constants/howItWorks";
import { colors, space } from "../../../constants/theme";

const SERVICE_TABS = SERVICES.map((s) => ({ value: s.key, label: s.label, icon: s.icon }));

/**
 * How HostelHubb works: a short intro, one service at a time (Rooms /
 * Storage / Transport), ways to earn, and what we stand for.
 */
export default function HowHostelHubbWorks() {
  const router = useRouter();
  const [serviceKey, setServiceKey] = useState(SERVICES[0].key);
  const service = SERVICES.find((s) => s.key === serviceKey) || SERVICES[0];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Eyebrow style={{ color: colors.brand }}>{HOW_IT_WORKS_HERO.eyebrow}</Eyebrow>
        <Text variant="display">{HOW_IT_WORKS_HERO.title}</Text>
        <Text tone="secondary">{HOW_IT_WORKS_HERO.body}</Text>
      </View>

      <Section title="Our services" subtitle="Tap a service to see how it works." gap={space.md}>
        <Tabs variant="pill" stretch options={SERVICE_TABS} value={serviceKey} onChange={setServiceKey} />
        <ServiceGuide service={service} />
      </Section>

      <Section title="Ways to earn" subtitle="HostelHubb can pay you back, too." gap={space.sm}>
        {WAYS_TO_EARN.map((w) => (
          <FeatureCard key={w.title} icon={w.icon} title={w.title} badge={w.badge} body={w.body} tone="soft" onPress={() => router.push(w.route)} />
        ))}
      </Section>

      <Section title="What we stand for" gap={space.sm}>
        {PROMISE.map((p) => (
          <Card key={p.label} style={{ gap: 6 }}>
            <Eyebrow style={{ color: colors.brand }}>{p.label}</Eyebrow>
            <Text tone="secondary">{p.body}</Text>
          </Card>
        ))}
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: space.lg, paddingTop: space.xl, paddingBottom: space.xxxl, gap: space.xxl },
  hero: { gap: space.xs },
});
