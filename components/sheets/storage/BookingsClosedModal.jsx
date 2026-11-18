import React from "react";
import { Linking, Text, View } from "react-native";
import { Button, Sheet } from "../../ui";
import { colors, space, type } from "../../../constants/theme";

const SUPPORT_URL = "https://wa.me/233245746198";

/** Shown between storage cycles instead of starting a booking. */
export default function BookingsClosedModal({ visible, onClose }) {
  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Bookings are closed"
      footer={
        <View style={{ gap: space.xs }}>
          <Button title="Got it" onPress={onClose} />
          <Button title="Ask customer care" variant="ghost" onPress={() => Linking.openURL(SUPPORT_URL)} />
        </View>
      }
    >
      <Text style={[type.body, { color: colors.textSecondary }]}>
        Storage bookings for this break have closed. They open again before the next one; we'll send a notification.
      </Text>
    </Sheet>
  );
}
