import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { UserContext } from "../../context/UserContext";
import { purchaseData } from "../../services/purchaseData";
import { useNotificationPermission } from "../../hooks/notification/useNotificationPermission";

const providerPrefixes = {
  MTN: ["024", "025", "053", "054", "055", "059"],
  TELECEL: ["020", "050"],
};

const getProviderColor = (provider) => {
  switch ((provider || "").toUpperCase()) {
    case "MTN":
      return "#FBBF24";
    case "TELECEL":
      return "#EF4444";
    default:
      return "#111";
  }
};

const DataPurchaseModal = ({ isVisible, onClose, selectedPackage }) => {
  const { userInfo, user } = useContext(UserContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Add notification hook
  const { currentExpoToken, ensureNotificationsEnabled } = useNotificationPermission();

  const handleConfirm = async () => {
    if (!phoneNumber) {
      return Alert.alert("Error", "Please enter your phone number");
    }
    if (!/^0\d{9}$/.test(phoneNumber)) {
      return Alert.alert("Error", "Phone number must start with 0 and be 10 digits");
    }

    const first3 = phoneNumber.slice(0, 3);
    const allowedPrefixes = providerPrefixes[selectedPackage?.netprovider] || [];

    if (!allowedPrefixes.includes(first3)) {
      return Alert.alert(
        "Number Warning",
        `This number does not match the selected provider (${selectedPackage?.netprovider}). Do you still want to proceed?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes, use it", onPress: proceedPurchaseWithBalanceCheck },
        ]
      );
    }

    proceedPurchaseWithBalanceCheck();
  };

  const proceedPurchaseWithBalanceCheck = async () => {
    const price = parseFloat(selectedPackage.price);
    const userBalance = userInfo?.balance || 0;

    if (userBalance < price) {
      const amountNeeded = price - userBalance;
      return Alert.alert(
        "Insufficient Balance",
        `Your current balance (GHC ${userBalance.toFixed(2)}) is not enough to buy this bundle.\n\nYou need to top up at least GHC ${amountNeeded.toFixed(2)}.`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Top Up", 
            onPress: () => {
              onClose();
              setTimeout(() => router.replace("(ProfileScreens)/transactions"), 300);
            },
          },
        ]
      );
    }

    // Enforce notifications before proceeding
    const hasNotifications = await ensureNotificationsEnabled({
      title: "Enable Notifications",
      message: "Turn on notifications to receive updates about your data purchase status and delivery confirmation.",
    });

    if (!hasNotifications) return;

    proceedPurchase();
  };

  const proceedPurchase = async () => {
    setLoading(true);
    try {
      const result = await purchaseData({ 
        userInfo, 
        user, 
        selectedPackage, 
        phoneNumber,
        currentExpoToken, // Pass token to service
      });

      if (result.success) {
        Alert.alert(
          "Purchase Successful",
          `${result.message}\nYou bought ${selectedPackage.data_volume}GB for ${phoneNumber}.`
        );
        setPhoneNumber("");
        onClose();
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error("Purchase Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter Your Phone Number</Text>
                <Text style={styles.modalSubtitle}>
                  {selectedPackage 
                    ? `Package: ${selectedPackage.data_volume}GB • GHC ${selectedPackage.price}`
                    : "No package selected"}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="e.g. 0241234567"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  maxLength={10}
                />

                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: getProviderColor(selectedPackage?.netprovider) },
                  ]}
                  onPress={handleConfirm}
                  disabled={loading || !selectedPackage}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Confirm Purchase</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default DataPurchaseModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    color: "#111",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
});