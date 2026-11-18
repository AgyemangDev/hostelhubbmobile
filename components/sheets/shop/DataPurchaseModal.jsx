import React, { useState, useContext } from "react";
import { Alert, View } from "react-native";
import { useRouter } from "expo-router";
import { UserContext } from "../../../context/UserContext";
import { WalletContext } from "../../../context/WalletContext";
import { purchaseData } from "../../../services/purchaseData";
import { useNotificationPermission } from "../../../hooks/notification/useNotificationPermission";
import { Button, Sheet, Text, TextField } from "../../ui";
import { money } from "../../../utils/formatMoney";
import { space } from "../../../constants/theme";

const providerPrefixes = {
  MTN: ["024", "025", "053", "054", "055", "059"],
  TELECEL: ["020", "050"],
  AT: ["026", "027", "056", "057"]
};

const getProviderColor = (provider) => {
  switch ((provider || "").toUpperCase()) {
    case "MTN":
      return "#FBBF24";
    case "TELECEL":
      return "#EF4444";
    case "AT PREMIUM":
      return "#3B82F6";
    default:
      return "#111";
  }
};

const DataPurchaseModal = ({ isVisible, onClose, selectedPackage }) => {
  const { userInfo, user } = useContext(UserContext);
  // Student_Users.balance is gone — read from wallet_balances via
  // WalletContext instead of the old frozen profile field.
  const { balance: userBalance, refetchBalance } = useContext(WalletContext);
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
        await refetchBalance();
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
    <Sheet
      visible={isVisible}
      onClose={onClose}
      title="Enter your phone number"
      footer={
        <View style={{ gap: space.xs }}>
          <Button title="Confirm Purchase" onPress={handleConfirm} loading={loading} disabled={!selectedPackage} />
          <Button title="Cancel" variant="ghost" onPress={onClose} disabled={loading} />
        </View>
      }
    >
      <View style={{ gap: space.md }}>
        <Text variant="caption" tone="secondary">
          {selectedPackage ? `Package: ${selectedPackage.data_volume}GB • ${money(selectedPackage.price)}` : "No package selected"}
        </Text>
        <TextField
          label="Phone number"
          placeholder="e.g. 0241234567"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          maxLength={10}
        />
      </View>
    </Sheet>
  );
};

export default DataPurchaseModal;
