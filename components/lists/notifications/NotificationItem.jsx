import React from "react";
import { Image, Linking, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Text } from "../../ui";
import NotificationIcon from "./NotificationIcon";
import { toAppRoute } from "../../../utils/links";
import { colors, radius, space } from "../../../constants/theme";

const LINK = /(https?:\/\/[^\s]+)/g;

/** HostelHubb links open the matching screen in the app; everything else opens outside. */
async function openLink(url) {
  const route = toAppRoute(url);
  if (route) return router.push(route);
  if (await Linking.canOpenURL(url)) return Linking.openURL(url);
  console.warn("Don't know how to open URI: " + url);
}

/**
 * One notification: tinted icon, title with an unread dot, the message
 * (any links in it are tappable), an optional action button and the time.
 */
export default function NotificationItem({ item, onPress }) {
  const parts = String(item.message || "").split(LINK);
  const action = item.action;

  return (
    <Card
      variant={item.read ? "outlined" : "brand"}
      onPress={() => onPress?.(item)}
      accessibilityLabel={`${item.read ? "" : "Unread. "}${item.title}`}
      style={styles.card}
    >
      <NotificationIcon icon={item.icon} tone={item.tone} type={item.type} status={item.status} />

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="bodyStrong" style={[styles.title, !item.read && styles.unreadTitle]}>
            {item.title}
          </Text>
          {!item.read ? <View style={styles.dot} accessibilityElementsHidden /> : null}
        </View>

        <Text variant="body" tone="secondary">
          {parts.map((part, i) =>
            /^https?:\/\//.test(part) ? (
              <Text key={i} variant="body" tone="brand" style={styles.link} onPress={() => openLink(part)}>
                {part}
              </Text>
            ) : (
              part
            )
          )}
        </Text>

        {item.image ? <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" /> : null}

        <View style={styles.footer}>
          <Text variant="caption" tone="muted">{item.time}</Text>
          {action ? (
            <Button
              title={action.label}
              icon={action.icon}
              variant="secondary"
              size="sm"
              compact
              onPress={() => {
                onPress?.(item);
                // Server notifications navigate in onPress (NotificationScreen.open).
                if (item.server) return;
                action.route ? router.push(action.route) : openLink(action.url);
              }}
            />
          ) : null}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "flex-start", gap: space.sm },
  body: { flex: 1, gap: 4 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: space.xs },
  title: { flex: 1 },
  unreadTitle: { fontWeight: "800" },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand, marginTop: 7 },
  link: { textDecorationLine: "underline" },
  image: { height: 150, width: "100%", borderRadius: radius.md, marginTop: space.xs },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space.sm, marginTop: space.xxs, minHeight: 32 },
});
