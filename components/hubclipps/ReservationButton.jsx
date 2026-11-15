import React, { useContext, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import { UserContext } from "../../context/UserContext";
import ClientLogIn from "../../app/(Client)/ClientLogIn";
import { Button, PressableScale, Sheet, money } from "../ui/ds";
import { colors, onVideo, radius, space, type } from "../../constants/theme";

const FEE_RATE = 0.05;

/**
 * Price on the left, white Reserve pill on the right. Tapping Reserve opens
 * a confirmation sheet with the full price breakdown before anything is sent.
 */
export default function ReservationButton({ onPress, price, onBookingComplete, title }) {
  const base = Number(price) || 0;
  const fee = Math.round(base * FEE_RATE * 100) / 100;
  const total = base + fee;
  const { user, userInfo } = useContext(UserContext);
  const [showAuth, setShowAuth] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const open = () => {
    if (!user || !userInfo) return setShowAuth(true);
    setConfirming(true);
  };

  const send = async () => {
    setLoading(true);
    try {
      await onPress();
      await onBookingComplete?.();
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.bar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.price}>{money(total, { decimals: 0 })}</Text>
          <Text style={styles.caption}>per year, fees included</Text>
        </View>
        <PressableScale onPress={open} accessibilityRole="button" accessibilityLabel={`Reserve for ${money(total, { decimals: 0 })}`} style={styles.pill}>
          {loading ? <ActivityIndicator color={colors.text} /> : <Text style={styles.pillText}>Reserve</Text>}
        </PressableScale>
      </View>

      <Sheet
        visible={confirming}
        onClose={() => !loading && setConfirming(false)}
        title="Reserve this room"
        footer={
          <View style={{ flexDirection: "row", gap: space.sm }}>
            <Button title="Keep watching" variant="secondary" onPress={() => setConfirming(false)} disabled={loading} style={{ flex: 1 }} />
            <Button title="Send request" onPress={send} loading={loading} style={{ flex: 1.3 }} />
          </View>
        }
      >
        <View style={{ gap: space.md }}>
          {title ? <Text style={type.bodyStrong}>{title}</Text> : null}
          <View style={styles.breakdown}>
            <View style={styles.line}><Text style={type.body}>Room, full year</Text><Text style={type.body}>{money(base)}</Text></View>
            <View style={styles.line}><Text style={type.body}>Service fee (5%)</Text><Text style={type.body}>{money(fee)}</Text></View>
            <View style={[styles.line, styles.total]}><Text style={[type.bodyStrong, { fontWeight: "800" }]}>Total</Text><Text style={[type.bodyStrong, { fontWeight: "800" }]}>{money(total)}</Text></View>
          </View>
          <View style={styles.reassure}>
            <Text style={[type.caption, { color: colors.success, fontWeight: "600" }]}>
              You pay nothing today. We'll confirm the room, then you have time to pay.
            </Text>
          </View>
        </View>
      </Sheet>

      <Modal visible={showAuth} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowAuth(false)}>
        <ClientLogIn onClose={() => setShowAuth(false)} />
      </Modal>
    </>
  );
}

const shadow = onVideo.text;
const styles = StyleSheet.create({
  bar: { flexDirection: "row", alignItems: "center", gap: space.md },
  price: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", ...shadow },
  caption: { color: "#E7E5E4", fontSize: 12, fontWeight: "600", ...shadow },
  // Shadow so the white pill still stands out on a white or bright frame.
  pill: { minHeight: 52, minWidth: 128, paddingHorizontal: space.xl, borderRadius: 26, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 5 },
  pillText: { fontSize: 16, fontWeight: "800", color: colors.text },
  breakdown: { gap: space.sm, padding: space.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  line: { flexDirection: "row", justifyContent: "space-between" },
  total: { paddingTop: space.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderStrong },
  reassure: { padding: space.sm + 2, borderRadius: radius.md, backgroundColor: colors.successBg },
});
