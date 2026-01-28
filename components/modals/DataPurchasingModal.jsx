import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { useRouter } from "expo-router";
import { UserContext } from "../../context/UserContext";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../app/firebase/FirebaseConfig";
import axios from "axios";

const DataPurchaseModal = ({ isVisible, onClose, selectedPackage }) => {
  const { userInfo, user } = useContext(UserContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Allowed prefixes for networks
  const providerPrefixes = {
    MTN: ["024", "025", "053", "054", "055", "059"],
    TELECEL: ["020", "050"],
  };

  // Dynamic button color by provider
  const getProviderColor = (provider) => {
    const p = provider?.toUpperCase();
    switch (p) {
      case "MTN":
        return "#FBBF24"; // soft MTN yellow
      case "TELECEL":
        return "#EF4444"; // reddish for Telecel
      default:
        return "#111"; // fallback
    }
  };

  // Handle the purchase confirmation
  const handleConfirm = async () => {
    if (!phoneNumber) {
      return Alert.alert("Error", "Please enter your phone number");
    }

    if (!/^0\d{9}$/.test(phoneNumber)) {
      return Alert.alert(
        "Error",
        "Phone number must start with 0 and be 10 digits"
      );
    }

    // Check provider prefix safely
    const first3 = phoneNumber.slice(0, 3);
    const allowedPrefixes =
      providerPrefixes[selectedPackage?.netprovider] || [];

    if (!allowedPrefixes.includes(first3)) {
      // Number does not match selected provider
      return Alert.alert(
        "Number Warning",
        `This number does not match the selected provider (${selectedPackage?.netprovider}). Do you still want to proceed?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, use it",
            onPress: () => proceedPurchase(),
          },
        ]
      );
    }

    // If prefix is okay, proceed
    proceedPurchase();
  };

  const proceedPurchase = async () => {
    setLoading(true);
    try {
      const userBalance = userInfo.balance || 0;
      const price = selectedPackage?.price || 0;

      if (userBalance < price) {
        const amountNeeded = price - userBalance;
        Alert.alert(
          "Insufficient Balance",
          `Your balance (GHC ${userBalance.toFixed(
            2
          )}) is not enough. You need at least GHC ${amountNeeded.toFixed(2)}.`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Go to Transactions",
              onPress: () => {
                onClose();
                router.push("(ProfileScreens)/transactions");
              },
            },
          ]
        );
        setLoading(false);
        return;
      }

      // Prepare API payload
      const payload = {
        email: userInfo.email,
        customer_name:
          userInfo.firstName +
          " " +
          (userInfo.surname || userInfo.lastName || ""),
        customer_phone: phoneNumber,
        idd: user.uid,
        bundle: parseInt(selectedPackage.data_volume, 10),
        netprovider: selectedPackage.netprovider?.toLowerCase(),
      };

      console.log("📤 Sending payload:", payload);

      // Call backend API
      const response = await axios.post(
        "https://hostelhubbbackend.onrender.com/api/data-purchase",
        payload
      );

      if (response.status >= 200 && response.status < 300) {
        // Deduct balance atomically
        const userRef = doc(db, "Student_Users", user.uid);
        await updateDoc(userRef, { balance: increment(-price) });

        Alert.alert(
          "Purchase Successful",
          `You have successfully purchased ${selectedPackage.data_volume}GB for ${phoneNumber}.`
        );

        setPhoneNumber("");
        onClose();
      } else {
        Alert.alert(
          "Error",
          "Something went wrong with the purchase. Please try again."
        );
      }
    } catch (error) {
      console.error("Purchase Error:", error.response || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || error.message || "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Don't render modal if no package selected
  if (!selectedPackage) return null;

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Enter Your Phone Number</Text>
        <Text style={styles.modalSubtitle}>
          Package: {selectedPackage.data_volume}GB • GHC{" "}
          {selectedPackage.price}
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
    </Modal>
  );
};

export default DataPurchaseModal;

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
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
