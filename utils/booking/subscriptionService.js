import { Alert } from 'react-native';
import { ACCESS_FEE, BOOKING_MESSAGES, ACCESS_DURATION_MONTHS } from '../../constants/bookingConstants';
console.log("ACCESS_FEE in subscriptionService:", ACCESS_FEE);

/**
 * Handles subscription payment deduction with user consent
 * 
 * @param {Object} params
 * @param {Object} params.userInfo - User information
 * @param {Object} params.user - Firebase user object
 * @param {Function} params.patchUserData - Function to patch user data
 * @param {Object} params.router - Navigation router
 * @returns {Promise<boolean>} - True if payment succeeded, false otherwise
 */
export const handleSubscriptionPayment = async ({ userInfo, user, patchUserData, router }) => {
  const currentBalance = parseFloat(userInfo.balance) || 0;
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

  // Process payment via backend PATCH
  // Balance will be updated by database trigger when transaction is created
  return await processPaymentDeduction(patchUserData);
};

/**
 * Prompt user about insufficient balance
 * 
 * @private
 */
const promptInsufficientBalance = async (currentBalance, router) => {
  return await new Promise((resolve) => {
    Alert.alert(
      "You've Used Your 5 Free Bookings",
      `We're sorry you haven't found your perfect campus accommodation yet! To keep searching, we ask for a small commitment of GHC ${ACCESS_FEE} for ${ACCESS_DURATION_MONTHS} months of unlimited bookings.\n\nYour current balance is GHC ${currentBalance.toFixed(2)}, which isn't quite enough. Top up to continue your search!`,
      [
        {
          text: 'Top Up Now',
          onPress: () => {
            router.push('/(ProfileScreens)/transactions');
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
      'Show Your Commitment 🏠',
      `We're sorry you haven't found your perfect campus accommodation yet!\n\nYou've used your 5 free bookings. To continue searching, we ask that you show a small commitment of GHC ${ACCESS_FEE} — this gives you unlimited bookings for ${ACCESS_DURATION_MONTHS} months.\n\nCurrent Balance: GHC ${currentBalance.toFixed(2)}\nAfter Commitment: GHC ${newBalance.toFixed(2)}\n\nReady to find your perfect place?`,
      [
        {
          text: "Yes, I'm Committed!",
          onPress: () => resolve(true),
        },
        {
          text: 'Top Up Balance',
          onPress: () => {
            router.push('/(ProfileScreens)/transactions');
            resolve(false);
          },
        },
        {
          text: 'Not Now',
          style: 'cancel',
          onPress: () => resolve(false),
        },
      ]
    );
  });
};

/**
 * Process payment deduction via backend PATCH
 * Balance is NOT sent - it will be updated by database trigger
 * 
 * @private
 * @param {Function} patchUserData - Function to patch user data
 * @returns {Promise<boolean>} - True if successful
 */
// In subscriptionService.js
const processPaymentDeduction = async (patchUserData) => {
  try {
    console.log('📤 Sending subscription payment request...');
    
    const payload = {
      paymentstatus: true,
      paymentdate: new Date().toISOString(),
      subscriptionAmount: ACCESS_FEE,
    };
    
    console.log('📦 Payload being sent:', JSON.stringify(payload, null, 2));
    
    await patchUserData(payload);

    console.log('✅ Subscription payment processed successfully');
    return true;
  } catch (err) {
    console.error('❌ Payment error:', err);
    Alert.alert(
      BOOKING_MESSAGES.PAYMENT_ERROR.title,
      BOOKING_MESSAGES.PAYMENT_ERROR.message,
      [{ text: 'OK' }]
    );
    return false;
  }
};
// ```

// ## Key Changes:

// 1. **Removed `balance` from updates** - It's not in `ALLOWED_FIELDS` and shouldn't be sent from frontend
// 2. **Backend creates transaction FIRST** - This triggers the database trigger to update balance
// 3. **Then updates paymentstatus and paymentdate** - After balance is already updated
// 4. **`subscriptionAmount` is a signal** - Not stored in Student_Users, just tells backend to create transaction

// ## The Flow Now:
// ```
// Frontend sends:
// {
//   paymentstatus: true,
//   paymentdate: "2026-02-07...",
//   subscriptionAmount: 5  // Signal only
// }
//     ↓
// Backend receives patch
//     ↓
// Backend detects subscriptionAmount
//     ↓
// Backend creates transaction with amount: 5
//     ↓
// 🔥 Database trigger fires
//     ↓
// Database updates balance automatically
// (balance = balance - 5)
//     ↓
// Backend updates paymentstatus + paymentdate
//     ↓
// SSE stream sends updated user data to frontend
//     ↓
// Frontend UI updates automatically ✅