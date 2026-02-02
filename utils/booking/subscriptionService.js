import { Alert } from 'react-native';
import { supabase } from '../../app/firebase/supabaseConfig';
import { ACCESS_FEE, BOOKING_MESSAGES } from '../../constants/bookingConstants';

/**
 * Handles subscription payment deduction with user consent
 * 
 * @param {Object} params
 * @param {Object} params.userInfo - User information
 * @param {number} params.userInfo.id - User ID
 * @param {number} params.userInfo.balance - Current balance
 * @param {Object} params.router - Navigation router
 * @returns {Promise<boolean>} - True if payment succeeded, false otherwise
 */
export const handleSubscriptionPayment = async ({ userInfo, router }) => {
  const currentBalance = userInfo.balance || 0;
  const newBalance = currentBalance - ACCESS_FEE;

  // Case 1: Insufficient balance
  if (currentBalance < ACCESS_FEE) {
    return await promptInsufficientBalance(currentBalance, router);
  }

  // Case 2: Sufficient balance - request consent
  const userConsent = await requestPaymentConsent(currentBalance, newBalance, router);
  
  if (!userConsent) {
    return false;
  }

  // Process payment
  return await processPaymentDeduction(userInfo.id, newBalance);
};

/**
 * Prompt user about insufficient balance
 * 
 * @private
 */
const promptInsufficientBalance = async (currentBalance, router) => {
  return await new Promise((resolve) => {
    Alert.alert(
      "You've used your free booking",
      `Insufficient balance. You need GHC ${ACCESS_FEE} to continue. Your current balance is GHC ${currentBalance.toFixed(
        2
      )}. Subscribe to HostelHubb for unlimited hostel bookings.`,
      [
        {
          text: 'Top Up Now',
          onPress: () => {
            router.push('/transactions');
            resolve(false);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(false),
        },
      ]
    );
  });
};

/**
 * Request user consent for payment deduction
 * 
 * @private
 */
const requestPaymentConsent = async (currentBalance, newBalance, router) => {
  return await new Promise((resolve) => {
    Alert.alert(
      'Booking Fee Required',
      `To complete this booking, GHC ${ACCESS_FEE} will be deducted from your account.\n\nCurrent Balance: GHC ${currentBalance.toFixed(
        2
      )}\nNew Balance would be: GHC ${newBalance.toFixed(
        2
      )}\n\nDo you want to proceed?`,
      [
        {
          text: 'Yes, Proceed',
          onPress: () => resolve(true),
        },
        {
          text: 'No, Top Up',
          onPress: () => {
            router.push('/transactions');
            resolve(false);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(false),
        },
      ]
    );
  });
};

/**
 * Process payment deduction in database
 * 
 * @private
 * @param {string} userId - User ID
 * @param {number} newBalance - New balance after deduction
 * @returns {Promise<boolean>} - True if successful
 */
const processPaymentDeduction = async (userId, newBalance) => {
  try {
    const { error } = await supabase
      .from('Student_Users')
      .update({
        balance: newBalance,
        paymentstatus: true,
        paymentdate: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Payment update error:', error);
      Alert.alert(
        BOOKING_MESSAGES.PAYMENT_ERROR.title,
        BOOKING_MESSAGES.PAYMENT_ERROR.message,
        [{ text: 'OK' }]
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error('Payment error:', err);
    Alert.alert(
      BOOKING_MESSAGES.PAYMENT_ERROR.title,
      BOOKING_MESSAGES.PAYMENT_ERROR.message,
      [{ text: 'OK' }]
    );
    return false;
  }
};