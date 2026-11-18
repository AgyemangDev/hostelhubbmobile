// StorageBookingDetails.jsx
import React from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Divider, FadeIn, ScreenHeader, StatusPill, Timeline, Eyebrow } from "../../../components/ui";
import { money } from "../../../utils/formatMoney";
import { colors, radius, space, type } from "../../../constants/theme";
import { useBookingsContext } from "../../../context/BookingsContext";

// Helper: safely parse a field that may already be an object, or may be a
// JSON string (as it comes straight out of the DB row), or may be missing.
const safeParse = (value, fallback) => {
  if (value == null) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const StorageBookingDetails = () => {
  // Opened from the bookings list (`booking`, a JSON snapshot) or from a link
  // or notification (`id` only, e.g. /bookings/storage/:id).
  const { booking, id } = useLocalSearchParams();
  const router = useRouter();

  const paramBooking = booking ? safeParse(booking, null) : null;
  const orderId = paramBooking?.id ?? id;
  // Prefer the live copy from the shared bookings list so edits (date/location)
  // show up immediately instead of the snapshot captured when this screen opened.
  const { storageBookings, loading } = useBookingsContext();
  const rawBooking =
    (storageBookings || []).find((b) => String(b.id) === String(orderId)) || paramBooking;

  if (!rawBooking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: colors.surface }}>
        {loading ? (
          <ActivityIndicator color={colors.brand} />
        ) : (
          <Text style={{ fontSize: 15, color: colors.textSecondary, textAlign: "center" }}>
            We couldn't find this storage order on your account.
          </Text>
        )}
      </View>
    );
  }

  // items / pickup_info / delivery_info are stored as JSON strings in the
  // DB row, so they need a second parse pass here.
  const parsedBooking = {
    ...rawBooking,
    items: safeParse(rawBooking.items, []),
    pickup_info: safeParse(rawBooking.pickup_info, {}),
    delivery_info: safeParse(rawBooking.delivery_info, {}),
  };

  // Real rows carry pickup_status / delivery_status (not a single flat
  // `status`) — same fields the booking card uses.
  const isPickupPending = parsedBooking.pickup_status === "pending";
  const isPickupCompleted =
    parsedBooking.pickup_status === "picked_up" || parsedBooking.pickup_status === "completed";
  const isDelivered =
    parsedBooking.delivery_status === "completed" || parsedBooking.delivery_status === "delivered";

  // Format dates — handles both ISO ("2025-09-11") and DD/MM/YYYY ("20/09/2025").
  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    let date;
    if (typeof dateString === "string" && dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateString);
    }
    if (isNaN(date.getTime())) return "Not scheduled";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProgress = () => {
    if (isDelivered) return 100;
    if (isPickupCompleted) return 50;
    return 0;
  };

  // DB field is `price` (a string, e.g. "69.98"); `totalPrice` doesn't
  // exist on the real row, so it was always falling back to 0.
  const totalAmount = Number(parsedBooking.totalPrice ?? parsedBooking.price ?? 0);
  const displayRef = parsedBooking.bookingReference ?? parsedBooking.id ?? "";

  const pickupArea = parsedBooking.pickup_info?.area;
  const pickupRoom = parsedBooking.pickup_info?.room;
  const pickupHostel = parsedBooking.pickup_info?.hostel;
  const pickupLocation =
    pickupHostel || pickupArea
      ? [pickupHostel, pickupArea, pickupRoom ? `Room ${pickupRoom}` : null]
          .filter(Boolean)
          .join(" • ")
      : null;

  const deliveryArea = parsedBooking.delivery_info?.area;
  const deliveryRoom = parsedBooking.delivery_info?.room;
  const deliveryHostel = parsedBooking.delivery_info?.hostel;
  const deliveryOffCampusArea = parsedBooking.delivery_info?.offCampusArea;
  const deliveryLocation =
    deliveryHostel || deliveryArea || deliveryOffCampusArea
      ? [deliveryHostel, deliveryOffCampusArea || deliveryArea, deliveryRoom ? `Room ${deliveryRoom}` : null]
          .filter(Boolean)
          .join(" • ")
      : null;

  const deliveryDate = parsedBooking.delivery_date ?? parsedBooking.delivery_info?.date;
  const needsDelivery = !isDelivered && (!deliveryLocation || !deliveryDate || parsedBooking.delivery_info?.decideLater);
  const status = isDelivered
    ? { label: "Delivered", tone: "success", title: "Your items are back with you" }
    : isPickupCompleted
    ? { label: "In storage", tone: "success", title: "Your items are safe with us" }
    : { label: "Awaiting pickup", tone: "warning", title: "We'll collect your items soon" };
  const itemCount = (parsedBooking.items || []).reduce((n, i) => n + (Number(i.quantity) || 1), 0);
  const openEdit = () =>
    router.push({ pathname: "/StorageEdit", params: { booking: JSON.stringify(rawBooking) } });

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Storage order" subtitle={`#${String(displayRef).slice(0, 13)}`} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <FadeIn style={{ gap: space.xs }}>
          <StatusPill label={status.label} tone={status.tone} />
          <Text style={type.display} accessibilityRole="header">{status.title}</Text>
          <Text style={[type.caption, { color: colors.textSecondary }]}>
            {itemCount} item{itemCount === 1 ? "" : "s"} · booked {formatDate(parsedBooking.order_date ?? parsedBooking.bookingDate)}
          </Text>
        </FadeIn>

        <Timeline
          steps={[
            { title: "Paid", subtitle: money(totalAmount), state: "done" },
            {
              title: isPickupCompleted ? "Picked up" : "Pickup",
              subtitle: [formatDate(parsedBooking.pickup_date ?? parsedBooking.pickup_info?.date), pickupLocation].filter(Boolean).join(" · "),
              state: isPickupCompleted ? "done" : "current",
            },
            {
              title: isDelivered ? "Delivered" : needsDelivery ? "Choose delivery details" : "Delivery",
              subtitle: [deliveryDate ? formatDate(deliveryDate) : null, deliveryLocation].filter(Boolean).join(" · ") || "Not set yet",
              state: isDelivered ? "done" : isPickupCompleted ? "current" : "todo",
            },
          ]}
        />

        {needsDelivery ? (
          <View style={styles.action}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[type.bodyStrong, { color: colors.warningText, fontWeight: "800" }]}>Set your delivery details</Text>
              <Text style={[type.caption, { color: colors.warningText }]}>So we can plan routes before you arrive.</Text>
            </View>
            <Button title="Set" size="sm" onPress={openEdit} />
          </View>
        ) : !isDelivered ? (
          <Button title="Change delivery details" variant="secondary" onPress={openEdit} />
        ) : null}

        <Divider />

        <View style={{ gap: space.sm }}>
          <Text style={type.heading}>Items</Text>
          {(parsedBooking.items || []).map((item, index) => (
            <View key={item.id ?? index} style={styles.itemRow}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.itemImage} />
              ) : (
                <View style={[styles.itemImage, { alignItems: "center", justifyContent: "center" }]}>
                  <Ionicons name="cube-outline" size={20} color={colors.textSecondary} />
                </View>
              )}
              <Text style={[type.body, { flex: 1 }]}>{item.category || item.name || "Item"} × {item.quantity}</Text>
              <Text style={type.body}>
                {money(item.totalPrice ?? (item.unitPrice ?? item.price ?? 0) * (item.quantity ?? 1))}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={[type.bodyStrong, { fontWeight: "800" }]}>Total paid</Text>
            <Text style={[type.bodyStrong, { fontWeight: "800" }]}>{money(totalAmount)}</Text>
          </View>
        </View>

        {parsedBooking.image_url ? (
          <View style={{ gap: space.sm }}>
            <Eyebrow>YOUR ITEMS PHOTO</Eyebrow>
            <Image source={{ uri: parsedBooking.image_url }} style={styles.photo} accessibilityLabel="Photo of your stored items" />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, paddingTop: space.xs, gap: space.xl, paddingBottom: space.xxxl },
  action: { flexDirection: "row", alignItems: "center", gap: space.sm, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.warningBg },
  itemRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
  itemImage: { width: 44, height: 44, borderRadius: radius.sm, backgroundColor: colors.fill },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: space.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderStrong },
  photo: { width: "100%", aspectRatio: 4 / 3, borderRadius: radius.lg, backgroundColor: colors.fill },
});

export default StorageBookingDetails;
