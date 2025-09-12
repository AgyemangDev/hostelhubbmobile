import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const WithdrawMoney = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [bankAccount, setBankAccount] = useState("");
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState("");
  const [network, setNetwork] = useState("");
  const [networkInput, setNetworkInput] = useState("");
  const [filteredNetworks, setFilteredNetworks] = useState([]);

  const totalBalance = "₵1500.00";

  const networks = ["MTN", "AirtelTigo", "Vodafone", "TELECEL"];

  const handleWithdraw = () => {
    if (!amount || !paymentMethod) {
      Alert.alert(
        "Error",
        "Please enter an amount and select a payment method."
      );
      return;
    }

    const methodInfo =
      paymentMethod === "Bank Account"
        ? `Bank Account: ${bankAccount}`
        : `Mobile Money Number: ${mobileMoneyNumber}, Network: ${network}`;

    Alert.alert(
      "Confirm Withdrawal",
      `You are about to withdraw ₵${amount} via ${paymentMethod}.\n${methodInfo}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            Alert.alert(
              "Success",
              "Withdrawal request submitted successfully!"
            );
            setAmount("");
            setPaymentMethod("");
            setBankAccount("");
            setMobileMoneyNumber("");
            setNetwork("");
            setNetworkInput("");
            setFilteredNetworks([]);
            setModalVisible(false);
          },
        },
      ]
    );
  };

  const openModal = (method) => {
    setPaymentMethod(method);
    setModalVisible(true);
  };

  const handleNetworkInputChange = (text) => {
    setNetworkInput(text);
    const filtered = networks.filter((net) =>
      net.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredNetworks(filtered);
  };

  const selectNetwork = (selectedNetwork) => {
    setNetwork(selectedNetwork);
    setNetworkInput(selectedNetwork);
    setFilteredNetworks([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Withdraw Money</Text>
      <Text style={styles.balanceText}>Total Balance: {totalBalance}</Text>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount to withdraw"
        placeholderTextColor={"#d6a4a4"}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Select Payment Method</Text>
      <View style={styles.methodButtons}>
        <TouchableOpacity
          style={styles.methodButton}
          onPress={() => openModal("Bank Account")}
        >
          <Icon name="university" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Bank Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.methodButton}
          onPress={() => openModal("Mobile Money")}
        >
          <Icon name="mobile" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Mobile Money</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalWrapper}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>HostelHubb Payment</Text>
            <Text style={styles.instructions}>
              Please complete your {paymentMethod} information below.
            </Text>
            {paymentMethod === "Bank Account" ? (
              <TextInput
                style={styles.input}
                placeholder="Enter bank account number"
                placeholderTextColor={"#d6a4a4"}
                keyboardType="numeric"
                value={bankAccount}
                onChangeText={setBankAccount}
              />
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Enter mobile money number"
                  placeholderTextColor={"#d6a4a4"}
                  keyboardType="numeric"
                  value={mobileMoneyNumber}
                  onChangeText={setMobileMoneyNumber}
                />
                <Text style={styles.label}>Select Network Provider</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Type to select a network"
                  placeholderTextColor={"#d6a4a4"}
                  value={networkInput}
                  onChangeText={handleNetworkInputChange}
                />
                {filteredNetworks.length > 0 && (
                  <FlatList
                    data={filteredNetworks}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.networkItem}
                        onPress={() => selectNetwork(item)}
                      >
                        <Text style={styles.networkText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    style={styles.networkList}
                  />
                )}
              </>
            )}
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={handleWithdraw}
            >
              <Text style={styles.buttonText}>Confirm Withdrawal</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#610b0c",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  methodButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  methodButton: {
    flex: 1,
    backgroundColor: "#610b0c",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    width: "90%",
    height: "85%",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: "#610b0c",
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#610b0c",
    marginBottom: 10,
  },
  instructions: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  withdrawButton: {
    backgroundColor: "#610b0c",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
    marginTop: 20,
  },
  networkList: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 100,
    marginTop: 5,
  },
  networkItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  networkText: {
    fontSize: 16,
    color: "#333",
  },
});

export default WithdrawMoney;
