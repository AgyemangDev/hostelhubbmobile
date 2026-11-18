import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, FadeIn, Icon, Notice, Text, Timeline } from "../../ui";
import { colors, radius, space } from "../../../constants/theme";

/**
 * How one service works: icon and title, a one-line summary, numbered steps,
 * a "good to know" note and a button into the service.
 * `service` comes from constants/howItWorks.js.
 */
export default function ServiceGuide({ service }) {
  const router = useRouter();
  return (
    <FadeIn key={service.key} style={styles.wrap}>
      <View style={styles.head}>
        <View style={styles.icon}>
          <Icon name={service.icon} size={24} tone="brand" />
        </View>
        <View style={styles.headText}>
          <Text variant="heading">{service.title}</Text>
          <Text tone="secondary">{service.summary}</Text>
        </View>
      </View>

      <Card>
        <Timeline variant="guide" steps={service.steps} />
      </Card>

      {service.note ? <Notice tone="success" icon="bulb-outline">{service.note}</Notice> : null}

      {service.cta ? (
        <Button title={service.cta.label} icon="arrow-forward" iconPosition="right" onPress={() => router.push(service.cta.route)} />
      ) : null}
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.md },
  head: { flexDirection: "row", gap: space.sm, alignItems: "flex-start" },
  icon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.brandSoft, alignItems: "center", justifyContent: "center" },
  headText: { flex: 1, gap: 4 },
});
