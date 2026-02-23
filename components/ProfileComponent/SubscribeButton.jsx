import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { db } from '../../app/firebase/FirebaseConfig';
import { doc, setDoc, collection } from 'firebase/firestore';
import { Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/Colors';

function SubscribeButton() {
  const { userInfo } = useContext(UserContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const ACCESS_FEE = 30; // Subscription fee
  const THREE_MONTHS_IN_MS = 3 * 30 * 24 * 60 * 60 * 1000; // 3 months in milliseconds
  const shouldCheckPaymentStatus = true; // Toggle for payment checks

  const handleSubscription = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    // Check if subscription is needed
    const subscriptionExpired =
      !userInfo.paymentStatus ||
      new Date() - userInfo.paymentDate.toDate() > THREE_MONTHS_IN_MS;

    if (shouldCheckPaymentStatus && subscriptionExpired) {
      // If balance is insufficient
      if (userInfo.balance < ACCESS_FEE) {
        Alert.alert(
          'Support Hostelhubb',
          `A GHC ${ACCESS_FEE} payment for a 6-month access to all hostels is required. Please deposit money to proceed.`,
          [
            {
              text: 'Deposit Money',
              onPress: () => {
                setIsProcessing(false);
                router.push('/transactions');
              },
            },
            { text: 'Cancel', style: 'cancel', onPress: () => setIsProcessing(false) },
          ]
        );
        return;
      }

      // If balance is sufficient
      Alert.alert(
        'Confirm Deduction',
        `You will be charged GHC ${ACCESS_FEE} for a 3-month subscription. Do you wish to proceed?`,
        [
          { text: 'No', style: 'cancel', onPress: () => setIsProcessing(false) },
          {
            text: 'Yes',
            onPress: async () => {
              const newBalance = userInfo.balance - ACCESS_FEE;
              const transactionId = new Date().getTime();
              const transactionRef = doc(collection(db, 'transaction'), transactionId.toString());

              try {
                // Create a transaction record
                await setDoc(transactionRef, {
                  userId: userInfo.id,
                  amount: ACCESS_FEE,
                  status: 'completed',
                  createdAt: new Date(),
                  method: 'HostelHubb Payment',
                  reference: 'Subscription Fee',
                });

                // Update user balance and subscription status
                const userRef = doc(db, 'Student_Users', userInfo.id);
                await setDoc(
                  userRef,
                  {
                    balance: newBalance,
                    paymentStatus: true,
                    paymentDate: new Date(),
                  },
                  { merge: true }
                );

                Alert.alert(
                  'Subscription Successful',
                  'Your subscription has been activated for the next 3 months. Thank you for supporting HostelHubb!'
                );
              } catch (error) {
                console.error('Error processing subscription:', error);
                Alert.alert('Error', 'Something went wrong. Please try again later.');
              } finally {
                setIsProcessing(false);
              }
            },
          },
        ]
      );
    } else {
      Alert.alert('Access Granted', 'You already have an active subscription.');
      setIsProcessing(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleSubscription}
      disabled={isProcessing}
    >
      <Text style={styles.buttonText}>Subscribe To Hostelhubb</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.background, // Green background for the button
    paddingVertical: 15, // Vertical padding for height
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 8, // Rounded corners
    width: '100%', // Full width button
    alignItems: 'center', // Center the text horizontally
    justifyContent: 'center',
    marginTop:10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16, 
    fontWeight: 'bold', 
  },
});

export default SubscribeButton;
