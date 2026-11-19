import React from "react";
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Button, EmptyState, ScreenHeader } from "../components/ui";
import NotificationItem from "../components/lists/notifications/NotificationItem";
import useAnnouncements from "../hooks/notification/useAnnouncements";
import { colors, space } from "../constants/theme";

/**
 * Notifications: the student's own updates (bookings, payments, complaints,
 * reminders, hostel announcements) first, then HostelHubb's notices.
 * Tapping one marks it read and opens what it is about.
 */
export default function NotificationsScreen() {
  const { items, unreadCount, loading, refresh, markRead, markAllRead } = useAnnouncements();

  const open = (item) => {
    markRead(item);
    if (item.server && item.action?.route) router.push(item.action.route);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader
        title="Notifications"
        subtitle={unreadCount ? `${unreadCount} unread` : "You're all caught up"}
        right={unreadCount ? <Button title="Mark all read" variant="ghost" size="sm" compact onPress={markAllRead} /> : null}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => `${item.server ? "s" : "n"}-${item.id}`}
        renderItem={({ item }) => <NotificationItem item={item} onPress={() => open(item)} />}
        ItemSeparatorComponent={() => <View style={{ height: space.sm }} />}
        ListEmptyComponent={<EmptyState icon="notifications-off-outline" title="No notifications" body="You're all caught up!" />}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.brand} />}
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
