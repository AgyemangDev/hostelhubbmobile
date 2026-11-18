import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Button, DetailRow, EmptyState, Eyebrow, FadeIn, Notice, PriceBar, ScreenHeader } from "../../../../components/ui";
import { money } from "../../../../utils/formatMoney";
import { colors, elevation, radius, space, type } from "../../../../constants/theme";
import { shareUrl } from "../../../../utils/links";
import { getBooking } from "../../../../utils/api/transportUnigo";
import { ticketQrUrl, ticketPdfDownloadUrl } from "../../../../utils/api/transportUnigo";
import { useResumePayment } from "../../../../hooks/transport/useResumePayment";

/**
 * Same ticket screen as `(transport)/Ticket.js`, minus the two native
 * modules that aren't in the current production build:
 *
 *  - `react-native-qrcode-svg` -> replaced with an <Image> pulling a PNG
 *    rendered by the backend at /api/transport-unigo/ticket/:groupRef/qr.
 *    Still encodes the same UniGo groupRef, so it scans identically.
 *
 *  - `expo-file-system` + `expo-sharing` -> replaced with
 *    `expo-web-browser` (already used elsewhere, e.g. PaymentScreen),
 *    opening the backend's PDF-proxy URL. The device's own browser sheet
 *    provides the save/share affordance instead of a native share sheet.
 *
 * If this whole approach needs to be rolled back, `(transport)/Ticket.js`
 * is left untouched and still works exactly as before.
 */


const Ticket = () => {
  const { groupRef, justPaid } = useLocalSearchParams();
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);
  const autoSaved = useRef(false);
  const { resume, busy: resuming } = useResumePayment();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getBooking(groupRef, { fresh: true });
      setBooking(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [groupRef]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      // No local file, no share sheet — just hand the browser a URL. The
      // browser's own UI (share / print / save to Files) covers what
      // `expo-sharing` used to.
      await WebBrowser.openBrowserAsync(ticketPdfDownloadUrl(groupRef));
      setSaved(true);
    } catch (err) {
      Alert.alert("Download failed", err.message);
    } finally {
      setDownloading(false);
    }
  }, [groupRef]);

  // Straight from payment: open the PDF once automatically. Later visits
  // from the Bookings tab just show the button.
  useEffect(() => {
    if (justPaid !== "1" || autoSaved.current) return;
    if (booking?.status !== "success") return;
    autoSaved.current = true;
    handleDownload();
  }, [justPaid, booking, handleDownload]);

  const done = () => router.replace("/(tabs)/(bookings)");

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <ScreenHeader title="Your ticket" hideBack right={<Button title="Done" variant="ghost" size="sm" onPress={done} />} />
        <View style={styles.centre}>
          <ActivityIndicator color={colors.brand} />
          <Text style={[type.caption, { color: colors.textSecondary }]}>Loading your ticket…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !booking) {
    return (
      <SafeAreaView style={styles.screen}>
        <ScreenHeader title="Your ticket" hideBack right={<Button title="Done" variant="ghost" size="sm" onPress={done} />} />
        <View style={styles.centre}>
          <EmptyState
            icon="alert-circle-outline"
            title="Couldn't load this ticket"
            body={error || "We couldn't find it on your account."}
            action={<Button title="Try again" variant="secondary" onPress={load} />}
          />
        </View>
      </SafeAreaView>
    );
  }

  const isPaid = booking.status === "success";
  const seatLabel = booking.seatNumbers?.join(", ") || "—";
  const resolvedGroupRef = booking.groupRef || groupRef;
  const shareTicket = () => {
    const url = shareUrl.ticket(resolvedGroupRef);
    Share.share({ message: `My bus ticket, ${booking.from} to ${booking.to}\n${url}`, url }).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
      <ScreenHeader title="Your ticket" hideBack right={<Button title="Done" variant="ghost" size="sm" onPress={done} />} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {!isPaid ? (
          <Notice
            tone="warning"
            title="Not paid yet"
            action={
              <Button
                title={`Complete payment · ${money(booking.total)}`}
                onPress={() => resume(groupRef, { onDone: load })}
                loading={resuming}
                size="sm"
              />
            }
          >
            There's no ticket until payment clears. Seats are held for {booking.holdMinutes || 5} minutes.
          </Notice>
        ) : null}

        <FadeIn style={styles.ticket}>
          <View style={styles.ticketTop}>
            <View style={styles.route}>
              <View style={{ flex: 1, gap: 2 }}>
                <Eyebrow>FROM</Eyebrow>
                <Text style={styles.city} numberOfLines={2}>{booking.from}</Text>
              </View>
              <Ionicons name="arrow-forward" size={22} color={colors.text} style={{ marginTop: 18 }} />
              <View style={{ flex: 1, gap: 2, alignItems: "flex-end" }}>
                <Eyebrow>TO</Eyebrow>
                <Text style={[styles.city, { textAlign: "right" }]} numberOfLines={2}>{booking.to}</Text>
              </View>
            </View>
            <View style={styles.details}>
              <DetailRow variant="stacked" label="DEPARTS" value={booking.departureTime} />
              <DetailRow variant="stacked" label={booking.seatCount > 1 ? "SEATS" : "SEAT"} value={isPaid ? seatLabel : "—"} />
              <DetailRow variant="stacked" label={isPaid ? "PAID" : "DUE"} value={money(booking.total)} align="end" />
            </View>
            {isPaid && booking.passenger?.name ? (
              <Text style={[type.caption, { color: colors.textSecondary }]}>Passenger: {booking.passenger.name}</Text>
            ) : null}
          </View>

          <View style={styles.perforation}>
            <View style={[styles.notch, { left: -12 }]} />
            <View style={styles.dash} />
            <View style={[styles.notch, { right: -12 }]} />
          </View>

          <View style={styles.qrWrap}>
            {isPaid ? (
              <>
                <View style={styles.qrFrame}>
                  <Image
                    source={{ uri: ticketQrUrl(resolvedGroupRef) }}
                    style={{ width: 200, height: 200 }}
                    resizeMode="contain"
                    accessibilityLabel="Boarding QR code"
                  />
                </View>
                <Text style={[type.bodyStrong, { letterSpacing: 1 }]} selectable>{booking.partnerRef}</Text>
                <Text style={[type.caption, { color: colors.textSecondary }]}>Turn your brightness up when you scan</Text>
              </>
            ) : (
              <>
                <View style={[styles.qrFrame, styles.qrLocked]}>
                  <Ionicons name="lock-closed-outline" size={28} color={colors.textSecondary} />
                </View>
                <Text style={[type.caption, { color: colors.textSecondary }]}>Your boarding code appears once payment clears</Text>
              </>
            )}
          </View>
        </FadeIn>

        {isPaid ? (
          <Notice tone={saved ? "success" : "info"}>
            {saved
              ? "Ticket opened. It also stays here in Bookings."
              : "Keep a copy on your phone: tickets aren't sent by email. It also stays here in Bookings."}
          </Notice>
        ) : null}

        <Text style={[type.caption, { color: colors.textSecondary, textAlign: "center" }]}>
          Operated by UniGo Transport. Be at your pickup point 30 minutes before departure.
        </Text>
      </ScrollView>

      <PriceBar>
        <View style={{ flex: 1, flexDirection: "row", gap: space.sm }}>
          <Button title="Save PDF" icon="download-outline" variant="secondary" onPress={handleDownload} loading={downloading} disabled={!isPaid} style={{ flex: 1 }} />
          <Button title="Share" icon="share-outline" variant="secondary" onPress={shareTicket} disabled={!isPaid} style={{ flex: 1 }} />
        </View>
      </PriceBar>
    </SafeAreaView>
  );
};

export default Ticket;

// PriceBar pads the bottom inset itself; padding it here too doubled the gap on iOS.
const SCREEN_EDGES = ["top", "left", "right"];

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.fill },
  centre: { flex: 1, alignItems: "center", justifyContent: "center", gap: space.sm, padding: space.xl },
  scroll: { padding: space.lg, paddingTop: space.xs, gap: space.lg, paddingBottom: space.xxl },
  ticket: { backgroundColor: colors.surface, borderRadius: radius.xl, ...elevation.floating, shadowOpacity: 0.08 },
  ticketTop: { padding: space.lg, gap: space.lg },
  route: { flexDirection: "row", gap: space.sm },
  city: { fontSize: 24, lineHeight: 29, fontWeight: "800", letterSpacing: -0.4, color: colors.text },
  details: { flexDirection: "row", gap: space.sm },
  perforation: { height: 24, justifyContent: "center" },
  dash: { borderTopWidth: 2, borderStyle: "dashed", borderColor: colors.borderStrong, marginHorizontal: space.lg },
  notch: { position: "absolute", width: 24, height: 24, borderRadius: 12, backgroundColor: colors.fill, top: 0 },
  qrWrap: { alignItems: "center", gap: space.xs, padding: space.lg, paddingTop: space.sm },
  qrFrame: { padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  qrLocked: { width: 200, height: 200, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceSunken },
});
