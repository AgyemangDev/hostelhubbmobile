import React, { useState, useContext } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Linking, ActivityIndicator } from "react-native";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import COLORS from "../../constants/Colors";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import DepositInstruction from "./DepositInstruction";
import SubscribeButton from "./SubscribeButton";

const AccountBalanceInfo = () => {
  const { userInfo } = useContext(UserContext);
  const [amount, setAmount] = useState(""); 
  const [loading, setLoading] = useState(false); // Loading state for activity indicator
  const email = userInfo?.email;
  const userId = userInfo?.id;
  const Userbalance = userInfo?.balance || 0.00;

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid deposit amount.");
      return;
    }

    try {
      setLoading(true); // Start loading
      const response = await axios.post('https://hostelhubbbackend.onrender.com/api/deposit', {
        amount: depositAmount * 100, // Convert to kobo if using Paystack
        email: email,
        id: userId,
        role: 'user'
      });

      const { authorization_url } = response.data; // Get the Paystack URL to redirect for payment
      Linking.openURL(authorization_url);
    } catch (error) {
      Alert.alert("Error", "Could not initiate deposit. Please try again.");
      console.error("Deposit error:", error);
    } finally {
      setLoading(false); // Stop loading
      setAmount("")
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deposit Money</Text>

      {/* Display Balance */}
      <View style={styles.balanceContainer}>
        <MaterialIcons name="account-balance-wallet" size={24} color={COLORS.background} />
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceValue}>₵{Userbalance.toFixed(2)}</Text>
        </View>
      </View>

      {/* Deposit Amount Input */}
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

      {/* Deposit Button */}
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
      <SubscribeButton/>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
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
