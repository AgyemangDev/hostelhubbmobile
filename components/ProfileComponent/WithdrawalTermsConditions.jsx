import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import TermsLink from '../Links/TermsLink';

const WithdrawalTermsConditions = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Withdrawals are processed between 24-72 hours of initiation, though they can be completed earlier in some cases.  
      </Text>
      <TermsLink
        link={"https://hostelhubb.com/cookie-policy"}
        text={"Read More on Our Withdrawal Policies."}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
});

export default WithdrawalTermsConditions;
