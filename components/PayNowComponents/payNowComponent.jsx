import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import COLORS from "../../constants/Colors";

/* ─── Bank constants ──────────────────────────────────────────────────────── */
export const BANK = {
  name: "NAG HOSTELHUBB",
  bank: "GT Bank",
  account: "3302001049665",
  whatsapp: "23345746198",
};

/* ─── Primitive rows ──────────────────────────────────────────────────────── */
export const Row = ({ label, value, valueStyle }) => (
  <View style={s.row}>
    <Text style={s.rowLabel}>{label}</Text>
    <Text style={[s.rowValue, valueStyle]}>{value}</Text>
  </View>
);

export const BankRow = ({ label, value, highlight }) => (
  <View style={s.bankRow}>
    <Text style={s.bankLabel}>{label}</Text>
    <Text style={[s.bankValue, highlight && s.bankHighlight]}>
      {value}
    </Text>
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

/* ─── Amount + wallet ─────────────────────────────────────────────────────── */
export const AmountSection = ({
  amount,
  userBalance,
  hasFunds,
}) => (
  <>
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

    <View style={s.section}>
      <Text style={s.sectionTitle}>
        HostelHubb wallet
      </Text>

      <View style={s.walletRow}>
        <Text style={s.walletLabel}>
          Available balance
        </Text>

        <Text
          style={[
            s.walletValue,
            !hasFunds && s.walletLow,
          ]}
        >
          GHS {userBalance.toFixed(2)}
        </Text>
      </View>
    </View>
  </>
);

/* ─── Bank transfer ───────────────────────────────────────────────────────── */
export const BankTransferSection = ({
  amount,
  bookingId,
  userInfo,
}) => {
  const openWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi, I just made a bank transfer for my HostelHubb booking.\n\nBooking ID: ${bookingId}\nAmount: GHS ${amount.toFixed(
        2
      )}\nName: ${
        userInfo.first_name
      } ${userInfo.surname}\n\nPlease find attached proof of payment.`
    );

    Linking.openURL(
      `https://wa.me/${BANK.whatsapp}?text=${msg}`
    );
  };

  return (
    <>
      <View style={s.orRow}>
        <View style={s.orLine} />
        <Text style={s.orText}>
          or pay via bank transfer
        </Text>
        <View style={s.orLine} />
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>
          Bank transfer
        </Text>

        <BankRow
          label="Account name"
          value={BANK.name}
        />

        <BankRow
          label="Bank"
          value={BANK.bank}
        />

        <BankRow
          label="Account number"
          value={BANK.account}
        />

        <BankRow
          label="Amount"
          value={`GHS ${amount.toFixed(2)}`}
          highlight
        />

        <View style={s.bankNote}>
          <Text style={s.bankNoteText}>
            After transferring, send us proof
            of payment via WhatsApp. Your
            booking will be activated within a
            few minutes.
          </Text>
        </View>

        <TouchableOpacity
          style={s.whatsappBtn}
          onPress={openWhatsApp}
          activeOpacity={0.8}
        >
          <Text style={s.whatsappBtnText}>
            📲 Send proof via WhatsApp
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

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

  bankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },

  bankLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },

  bankValue: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textDark,
  },

  bankHighlight: {
    color: COLORS.teal,
    fontWeight: "700",
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

  walletRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  walletLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },

  walletValue: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.teal,
  },

  walletLow: {
    color: COLORS.gold,
  },

  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    gap: 10,
  },

  orLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: COLORS.shadow,
  },

  orText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  bankNote: {
    marginTop: 10,
    backgroundColor: "#E1F5EE",
    borderRadius: 8,
    padding: 10,
    borderWidth: 0.5,
    borderColor: "#9FE1CB",
  },

  bankNoteText: {
    fontSize: 12,
    color: COLORS.teal,
    lineHeight: 18,
  },

  whatsappBtn: {
    marginTop: 10,
    backgroundColor: "#E1F5EE",
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#9FE1CB",
  },

  whatsappBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.teal,
  },
});