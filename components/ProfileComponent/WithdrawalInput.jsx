// WithdrawalInput.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import COLORS from '../../constants/Colors';

const WithdrawalInput = ({ withdrawalAmount, setWithdrawalAmount, isWithdrawalButtonActive, onWithdrawalInitiate }) => {
  
  const handleInitiateWithdrawal = () => {
    if (isWithdrawalButtonActive()) {
      onWithdrawalInitiate();
    } else {
      Alert.alert("Error", "Please fill all provided information");
    }
  };

  return (
    <View style={styles.amountContainer}>
      <Text style={styles.label}>Withdrawal Amount:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        value={withdrawalAmount}
        onChangeText={setWithdrawalAmount}
        keyboardType="numeric"
      />
      <TouchableOpacity 
        style={[styles.initiateButton, isWithdrawalButtonActive() ? styles.activeButton : styles.inactiveButton]} 
        onPress={handleInitiateWithdrawal}
        disabled={!isWithdrawalButtonActive()} 
      >
        <Text style={styles.initiateButtonText}>Initiate Withdrawal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  amountContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  initiateButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 16,
  },
  activeButton: {
    backgroundColor: COLORS.background,
  },
  inactiveButton: {
    backgroundColor: '#ccc',
  },
  initiateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default WithdrawalInput;
