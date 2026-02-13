// AccountBalanceInfo.jsx - UPDATED
import React, { useState, useContext } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Linking, ActivityIndicator } from "react-native";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import COLORS from "../../constants/Colors";
import { UserContext } from "../../context/UserContext";
import DepositInstruction from "./DepositInstruction";
import API_BASE_URL from "../../utils/api/api";

const AccountBalanceInfo = () => {
  const { user, userInfo } = useContext(UserContext);
  const [amount, setAmount] = useState(""); 
  const [loading, setLoading] = useState(false);
  const Userbalance = userInfo?.balance || 0.00;

// AccountBalanceInfo.jsx - FIX to use cached token

const handleDeposit = async () => {
  const depositAmount = parseFloat(amount);
  if (isNaN(depositAmount) || depositAmount <= 0) {
    Alert.alert("Invalid amount", "Please enter a valid deposit amount.");
    return;
  }

  if (!user) {
    Alert.alert("Error", "You must be logged in to deposit.");
    return;
  }

  try {
    setLoading(true);
    // FIX: Use forceRefresh: false
    const token = await user.getIdToken(false);

    const response = await fetch(`${API_BASE_URL}/api/deposit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: depositAmount,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to initiate deposit');
    }

    const data = await response.json();
    Linking.openURL(data.authorization_url);
  } catch (error) {
    Alert.alert("Error", "Could not initiate deposit. Please try again.");
    console.error("Deposit error:", error);
  } finally {
    setLoading(false);
    setAmount("");
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deposit once, use Everywhere</Text>

      <View style={styles.balanceContainer}>
        <MaterialIcons name="account-balance-wallet" size={24} color={COLORS.background} />
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceValue}>₵{Userbalance.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="money" size={20} color={COLORS.placeholder} />
        <TextInput
          style={styles.input}
          placeholder="Enter amount to deposit"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor={COLORS.placeholder}
        />
      </View>

      <Pressable style={styles.depositButton} onPress={handleDeposit} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <FontAwesome name="arrow-circle-up" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Deposit</Text>
          </>
        )}
      </Pressable>
      <DepositInstruction/>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
    color: "#504b4b",
    textAlign: "center",
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  balanceInfo: {
    marginLeft: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: "#555",
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.background,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  depositButton: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default AccountBalanceInfo;
