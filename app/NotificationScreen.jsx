import React from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { Button, EmptyState, ScreenHeader } from "../components/ui";
import NotificationItem from "../components/lists/notifications/NotificationItem";
import useAnnouncements from "../hooks/notification/useAnnouncements";
import { colors, space } from "../constants/theme";

/** Notifications: safety notices, news and offers, newest-unread highlighted. */
export default function NotificationsScreen() {
  const { items, unreadCount, markRead, markAllRead } = useAnnouncements();

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader
        title="Notifications"
        subtitle={unreadCount ? `${unreadCount} unread` : "You're all caught up"}
        right={unreadCount ? <Button title="Mark all read" variant="ghost" size="sm" compact onPress={markAllRead} /> : null}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} onPress={() => markRead(item.id)} />}
        ItemSeparatorComponent={() => <View style={{ height: space.sm }} />}
        ListEmptyComponent={<EmptyState icon="notifications-off-outline" title="No notifications" body="You're all caught up!" />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surfaceSunken },
  list: { padding: space.md, paddingBottom: space.xxl },
});
