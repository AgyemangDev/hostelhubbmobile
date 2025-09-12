import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import COLORS from '../../constants/Colors';

const BankAccountDetails = ({ onDetailsSubmit }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [bank, setBank] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const banks = [
    { label: 'Select Bank', value: '' },
    { label: 'Absa Bank Ghana', value: 'Absa Bank Ghana' },
    { label: 'Access Bank Ghana', value: 'Access Bank Ghana' },
    { label: 'Agricultural Development Bank (ADB)', value: 'Agricultural Development Bank (ADB)' },
    { label: 'Bank of Africa Ghana', value: 'Bank of Africa Ghana' },
    { label: 'Bank of Ghana', value: 'Bank of Ghana' },
    { label: 'Cal Bank', value: 'Cal Bank' },
    { label: 'Consolidated Bank of Ghana(CBG)', value: 'Consolidated Bank of Ghana(CBG)' },
    { label: 'Ecobank Ghana', value: 'Ecobank Ghana' },
    { label: 'Fidelity Bank Ghana', value: 'Fidelity Bank Ghana' },
    { label: 'First Atlantic Bank', value: 'First Atlantic Bank' },
    { label: 'First National Bank Ghana', value: 'First National Bank Ghana' },
    { label: 'Ghana Commercial Bank (GCB)', value: 'Ghana Commercial Bank (GCB)' },
    { label: 'Guaranty Trust Bank (GTBank)', value: 'Guaranty Trust Bank (GTBank)' },
    { label: 'National Investment Bank (NIB)', value: 'National Investment Bank (NIB)' },
    { label: 'Nedbank Ghana', value: 'Nedbank Ghana' },
    { label: 'OmniBank Ghana', value: 'OmniBank Ghana' },
    { label: 'Prudential Bank', value: 'Prudential Bank' },
    { label: 'Republic Bank', value: 'Republic Bank' },
    { label: 'Stanbic Bank Ghana', value: 'Stanbic Bank Ghana' },
    { label: 'Standard Chartered Bank Ghana', value: 'Standard Chartered Bank Ghana' },
    { label: 'Universal Merchant Bank (UMB)', value: 'Universal Merchant Bank (UMB)' },
    { label: 'United Bank for Africa(UBA)', value: 'United Bank for Africa(UBA)' },
    { label: 'Zenith Bank Ghana', value: 'Zenith Bank Ghana' },
  ];

  const handleSubmit = () => {
    if (!accountNumber || !bank || !accountName) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    onDetailsSubmit({ accountNumber, provider: bank, accountName });
  };

  const isSubmitEnabled = accountNumber && bank && accountName;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Bank Account Details</Text>
      <TextInput
        placeholderTextColor={COLORS.placeholder}
        style={styles.input}
        placeholder="Account Number"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
      />
      
      <TouchableOpacity 
        style={styles.dropdown} 
        onPress={() => setDropdownVisible(!isDropdownVisible)}
      >
        <Text style={styles.dropdownText}>{bank || "Select Bank"}</Text>
      </TouchableOpacity>

      {isDropdownVisible && (
        <ScrollView style={styles.dropdownList} nestedScrollEnabled>
          {banks.map((b) => (
            <TouchableOpacity 
              key={b.value} 
              style={styles.dropdownItem} 
              onPress={() => {
                setBank(b.value);
                setDropdownVisible(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{b.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TextInput
        placeholderTextColor={COLORS.placeholder}
        style={styles.input}
        placeholder="Account Name"
        value={accountName}
        onChangeText={setAccountName}
      />
      
      <TouchableOpacity 
        style={[styles.submitButton, !isSubmitEnabled && styles.disabledButton]} 
        onPress={handleSubmit} 
        disabled={!isSubmitEnabled}
      >
        <Text style={styles.submitButtonText}>Submit Bank Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 50,
    borderColor: COLORS.background,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: COLORS.background,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 12,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownList: {
    borderColor: COLORS.background,
    borderWidth: 2,
    borderRadius: 10,
    maxHeight: 150, // Limit height for scrolling
    marginBottom: 12,
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 10,
    width: '100%', // Match the width of the dropdown
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#28a745', // Green background for active button
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc', // Light gray for inactive button
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BankAccountDetails;
