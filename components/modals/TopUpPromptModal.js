import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import COLORS from "../../constants/Colors";

const TopUpPromptModal = ({
  visible,
  onClose,
  onTopUp,
  userBalance,
  amount,
}) => {
  const shortfall = (amount - userBalance).toFixed(2);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={s.modalOverlay}>
        <View style={s.modalCard}>
          <View style={s.modalHandle} />

          <Text style={s.modalIcon}>💰</Text>
          <Text style={s.modalTitle}>Wallet balance too low</Text>

          <View style={s.modalBreakdown}>
            <View style={s.modalBreakdownRow}>
              <Text style={s.modalBreakdownLabel}>Booking amount</Text>
              <Text
                style={[
                  s.modalBreakdownValue,
                  { color: COLORS.teal },
                ]}
              >
                GHS {amount.toFixed(2)}
              </Text>
            </View>

            <View style={s.modalDivider} />

            <View style={s.modalBreakdownRow}>
              <Text style={s.modalBreakdownLabel}>Your wallet</Text>
              <Text
                style={[
                  s.modalBreakdownValue,
                  { color: COLORS.gold },
                ]}
              >
                GHS {userBalance.toFixed(2)}
              </Text>
            </View>

            <View style={s.modalDivider} />

            <View style={s.modalBreakdownRow}>
              <Text
                style={[
                  s.modalBreakdownLabel,
                  {
                    fontWeight: "600",
                    color: COLORS.textDark,
                  },
                ]}
              >
                You need
              </Text>
              <Text
                style={[
                  s.modalBreakdownValue,
                  { color: COLORS.button },
                ]}
              >
                GHS {shortfall}
              </Text>
            </View>
          </View>

          <Text style={s.modalBody}>
            Top up your wallet with at least{" "}
            <Text style={s.modalBold}>
              GHS {shortfall}
            </Text>
            , then come back to pay.{"\n"}
          </Text>

          <TouchableOpacity
            style={s.modalPrimaryBtn}
            onPress={onTopUp}
            activeOpacity={0.85}
          >
            <Text style={s.modalPrimaryBtnText}>
              Top up wallet
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.modalSecondaryBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={s.modalSecondaryBtnText}>
              Back to payment options
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TopUpPromptModal;

const s = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
    alignItems: "center",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.shadow,
    marginBottom: 20,
  },
  modalIcon: { fontSize: 44, marginBottom: 10 },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 16,
    textAlign: "center",
  },
  modalBreakdown: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: COLORS.shadow,
  },
  modalBreakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  modalBreakdownLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  modalBreakdownValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  modalDivider: {
    height: 0.5,
    backgroundColor: COLORS.shadow,
    marginVertical: 2,
  },
  modalBody: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  modalBold: {
    fontWeight: "600",
    color: COLORS.textDark,
  },
  modalPrimaryBtn: {
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  modalPrimaryBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.white,
  },
  modalSecondaryBtn: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  modalSecondaryBtnText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
});