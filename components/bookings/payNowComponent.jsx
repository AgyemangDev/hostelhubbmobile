import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";

/* ─── Primitive rows ──────────────────────────────────────────────────────── */
export const Row = ({ label, value, valueStyle }) => (
  <View style={s.row}>
    <Text style={s.rowLabel}>{label}</Text>
    <Text style={[s.rowValue, valueStyle]}>{value}</Text>
  </View>
);

/* ─── Property card ───────────────────────────────────────────────────────── */
export const PropertyCard = ({
  accommodationInfo,
  room_type,
}) => {
  const imageUrl = accommodationInfo?.front_image ?? null;

  return (
    <View style={s.propertyCard}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={s.propImage}
          // Both the URL and the underlying data were verified reachable
          // and valid server-side (200, image/jpeg) for real accommodation
          // listings — if this still renders as a blank/placeholder on
          // device, this logs the RN Image loader's actual reason
          // (network, decode, unsupported format) instead of failing
          // silently, since that's the only way left to diagnose it further.
          onError={(e) =>
            console.warn("[PropertyCard] Image failed to load:", imageUrl, e.nativeEvent?.error)
          }
        />
      ) : (
        <View
          style={[
            s.propImage,
            s.propImagePlaceholder,
          ]}
        >
          <Text style={s.propImageIcon}>🏠</Text>
        </View>
      )}

      <View style={s.propInfo}>
        <Text
          style={s.propName}
          numberOfLines={1}
        >
          {accommodationInfo?.accommodation_name ??
            "Accommodation"}
        </Text>

        <Text
          style={s.propLocation}
          numberOfLines={2}
        >
          {accommodationInfo?.institution} ·{" "}
          {accommodationInfo?.location}
        </Text>

        <View style={s.badge}>
          <Text style={s.badgeText}>
            {room_type}
          </Text>
        </View>
      </View>
    </View>
  );
};

/* ─── Booking details ─────────────────────────────────────────────────────── */
export const BookingDetails = ({
  booking_date,
  status,
}) => (
  <View style={s.section}>
    <Text style={s.sectionTitle}>
      Booking details
    </Text>

    <Row
      label="Booking date"
      value={new Date(
        booking_date
      ).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    />

    <Row
      label="Status"
      value={status}
      valueStyle={s.statusChip}
    />
  </View>
);

/* ─── Amount ──────────────────────────────────────────────────────────────── */
// Direct Paystack is now the only accommodation payment path, so there's no
// wallet balance or bank-transfer fallback to show here anymore.
export const AmountSection = ({ amount }) => (
  <View style={s.section}>
    <Text style={s.sectionTitle}>
      Amount due
    </Text>

    <View style={s.amountBlock}>
      <Text style={s.amountLabel}>
        Total
      </Text>

      <Text style={s.amountValue}>
        GHS {amount.toFixed(2)}
      </Text>
    </View>
  </View>
);

/* ─── Referral (optional) ─────────────────────────────────────────────────── */
// Same "buyer picks a referrer at payment time" model as storage's
// ReferralStep.jsx, offered inline here since accommodation/hubclip
// payments are a single screen rather than a multi-step flow.
export const ReferralSection = ({
  code,
  onChangeCode,
  checking,
  match,
  error,
  onCheck,
  onClear,
}) => (
  <View style={s.section}>
    <Text style={s.sectionTitle}>Referral code (optional)</Text>

    {match ? (
      <View style={s.referralMatchRow}>
        <Ionicons name="checkmark-circle" size={18} color={COLORS.teal} />
        <Text style={s.referralMatchText}>
          Referred by {match.firstname} {match.surname}
        </Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={s.referralClear}>Remove</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={s.referralInputRow}>
        <TextInput
          style={s.referralInput}
          placeholder="Enter referral code"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="characters"
          value={code}
          editable={!checking}
          onChangeText={onChangeCode}
        />
        <TouchableOpacity
          style={[s.referralCheckBtn, (!code.trim() || checking) && s.referralCheckBtnDisabled]}
          onPress={onCheck}
          disabled={!code.trim() || checking}
        >
          {checking ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={s.referralCheckBtnText}>Check</Text>
          )}
        </TouchableOpacity>
      </View>
    )}

    {error && <Text style={s.referralError}>{error}</Text>}
  </View>
);

/* ─── Shared styles ───────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },

  rowLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },

  rowValue: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textDark,
  },


  propertyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: COLORS.shadow,
    marginBottom: 12,
  },

  propImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#E1F5EE",
  },

  propImagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },

  propImageIcon: {
    fontSize: 40,
  },

  propInfo: {
    padding: 14,
  },

  propName: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.textDark,
  },

  propLocation: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 3,
    lineHeight: 18,
  },

  badge: {
    alignSelf: "flex-start",
    marginTop: 8,
    backgroundColor: "#E1F5EE",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.teal,
  },

  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: COLORS.shadow,
    padding: 14,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  statusChip: {
    color: COLORS.teal,
    backgroundColor: "#E1F5EE",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    overflow: "hidden",
    fontSize: 12,
  },

  amountBlock: {
    alignItems: "center",
    paddingVertical: 8,
  },

  amountLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 4,
  },

  amountValue: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.teal,
  },

  referralInputRow: {
    flexDirection: "row",
    gap: 8,
  },

  referralInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.shadow,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textDark,
  },

  referralCheckBtn: {
    backgroundColor: COLORS.teal,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  referralCheckBtnDisabled: {
    opacity: 0.5,
  },

  referralCheckBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },

  referralMatchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E1F5EE",
    borderRadius: 10,
    padding: 10,
  },

  referralMatchText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textDark,
  },

  referralClear: {
    fontSize: 12,
    color: COLORS.textMuted,
    textDecorationLine: "underline",
  },

  referralError: {
    marginTop: 6,
    fontSize: 12,
    color: "#B91C1C",
  },
});
