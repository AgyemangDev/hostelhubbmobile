import React, { useState, useContext } from "react";
import {View,Text,StyleSheet,Alert,ActivityIndicator,TouchableOpacity,} from "react-native";
import BalanceDisplay from "./BalanceDisplay";
import BankAccountDetails from "./BankAccountDetails";
import MobileMoneyDetails from "./MobileMoneyDetails";
import { UserContext } from "../../context/UserContext";
import COLORS from "../../constants/Colors";
import WithdrawalInput from "./WithdrawalInput";
import { db } from "../../app/firebase/FirebaseConfig";
import { doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import WithdrawalTermsConditions from "./WithdrawalTermsConditions";

const WithdrawalScreen = () => {
  const { userInfo } = useContext(UserContext);
  const userId = userInfo?.id;
  const userBalance = userInfo?.balance || 0.0;

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [accountDetails, setAccountDetails] = useState({});
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAccountDetails = (details) => {
    setAccountDetails(details);
    Alert.alert(
      "Caution",
      "Please, ensure that you have provided the right details before proceeding. Hostelhubb would not be held account for any wrong transaction to provided account details. "
    );
  };

  const handleWithdrawal = () => {
    const { accountNumber, provider, accountName } = accountDetails;

    if (
      !selectedMethod ||
      !withdrawalAmount ||
      !accountNumber ||
      !provider ||
      !accountName
    ) {
      Alert.alert(
        "Error",
        "Please fill all the fields before initiating withdrawal"
      );
      return;
    }

    Alert.alert(
      "Confirm Withdrawal",
      `Are you sure you want to withdraw GHC ${withdrawalAmount} into your ${provider} wallet with account name ${accountName} and account number ${accountNumber}?`,
      [
        {
          text: "Cancel",
          onPress: () =>
            Alert.alert(
              "Cancelled",
              "Your withdrawal was cancelled. Thank you."
            ),
          style: "cancel",
        },
        {
          text: "Proceed",
          onPress: () => initiateWithdrawal(),
        },
      ]
    );
  };

  const initiateWithdrawal = async () => {
    const withdrawalAmountFloat = parseFloat(withdrawalAmount);
  
    // Check if the withdrawal amount is less than or equal to the user's balance
    if (withdrawalAmountFloat > userBalance) {
      Alert.alert(
        "Error",
        "You don't have enough funds to continue this transaction."
      );
      return;
    }
  
    // Calculate E-Levy (1% of the withdrawal amount)
    const eLevy = withdrawalAmountFloat * 0.025;
    const netAmount = withdrawalAmountFloat - eLevy;
  
    setLoading(true);
  
    try {
      // Create a receipt in the transaction document
      const transactionRef = doc(db, "transaction", `${Date.now()}`); // Unique document id
      await setDoc(transactionRef, {
        amount: netAmount, // Original withdrawal amount
        total:withdrawalAmountFloat, // Amount after deducting E-Levy
        eLevy:eLevy, // E-Levy deducted
        method: "Withdrawal",
        accountDetails: accountDetails,
        userId: userId, // Assuming adminId is the same as userId
        transactionType: selectedMethod,
        status: "pending",
        createdAt: serverTimestamp(),
      });
  
      // Update user's balance
      const userRef = doc(
        db,
        "Student_Users",
        userId
      ); // Adjust the path as necessary
      await updateDoc(userRef, {
        balance: userBalance - withdrawalAmountFloat,
      });
  
      Alert.alert(
        "Success",
        `Your withdrawal of GHC ${withdrawalAmountFloat} has been processed. A 2.5% transaction fee of GHC ${eLevy.toFixed(
          2
        )} has been deducted, and GHC ${netAmount.toFixed(
          2
        )} will be transferred to your account. You will receive payment within 24 hours. If taking longer, kindly contact hostelhubb customer care`
      );
      setAccountDetails({});
      setWithdrawalAmount("");
      setSelectedMethod(null); // Reset selected withdrawal method
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      Alert.alert(
        "Error",
        "An error occurred while processing your withdrawal. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  

  const isWithdrawalButtonActive = () => {
    const { accountNumber, provider, accountName } = accountDetails;
    return (
      selectedMethod &&
      withdrawalAmount &&
      accountNumber &&
      provider &&
      accountName
    );
  };

  return (
    <View style={styles.container}>
      <BalanceDisplay balance={userBalance} title="Withdraw Money" />

      <Text style={styles.heading}>Select Withdrawal Method</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.methodButton,
            selectedMethod === "bank"
              ? styles.selectedMethod
              : styles.unselectedMethod,
          ]}
          onPress={() => setSelectedMethod("bank")}
        >
          <Text style={styles.methodButtonText}>Bank Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodButton,
            selectedMethod === "mobileMoney"
              ? styles.selectedMethod
              : styles.unselectedMethod,
          ]}
          onPress={() => setSelectedMethod("mobileMoney")}
        >
          <Text style={styles.methodButtonText}>Mobile Money</Text>
        </TouchableOpacity>
      </View>

      {selectedMethod === "bank" && (
        <BankAccountDetails onDetailsSubmit={handleAccountDetails} />
      )}
      {selectedMethod === "mobileMoney" && (
        <MobileMoneyDetails onDetailsSubmit={handleAccountDetails} />
      )}

      <WithdrawalInput
        withdrawalAmount={withdrawalAmount}
        setWithdrawalAmount={setWithdrawalAmount}
        isWithdrawalButtonActive={isWithdrawalButtonActive}
        onWithdrawalInitiate={handleWithdrawal}
      />

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={COLORS.background} />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}
      <WithdrawalTermsConditions/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  methodButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  selectedMethod: {
    backgroundColor: COLORS.background,
  },
  unselectedMethod: {
    backgroundColor: "#d3d3d3",
  },
  methodButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Ensure overlay is on top
  },
  loadingText: {
    color: COLORS.background,
    marginTop: 10,
    fontSize: 18,
  },
});

export default WithdrawalScreen;
