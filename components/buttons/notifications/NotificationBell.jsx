import React from "react";
import { View } from "react-native";
import { CountBadge, IconButton } from "../../ui";
import useAnnouncements from "../../../hooks/notification/useAnnouncements";

/** Bell in the home header that opens notifications; shows a dot while any are unread. */
export default function NotificationBell({ onPress, variant = "tonal" }) {
  const { unreadCount } = useAnnouncements();
  return (
    <View>
      <IconButton
        icon={unreadCount ? "notifications" : "notifications-outline"}
        variant={variant}
        onPress={onPress}
        accessibilityLabel={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
      />
      <CountBadge count={unreadCount} dot />
    </View>
  );
}
