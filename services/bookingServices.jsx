import { Alert } from 'react-native';
import { doc, setDoc, collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../app/firebase/FirebaseConfig';
import { addBooking, incrementBookingCount } from '../utils/bookingIncrementUtil';
import { sendBookingEmail } from '../utils/bookingModalUtils';

const ACCESS_FEE = 30;

// Validate agent code early in the process
const validateAgentCode = async (agentCode) => {
  if (!agentCode || agentCode.trim() === '') {
    return { valid: true, message: 'No agent code provided' }; // No agent code is fine
  }
  
  try {
    const trimmedCode = agentCode.trim();
    const q = query(collection(db, "Student_Users"), where("agentCode", "==", trimmedCode));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { 
        valid: false, 
        message: "The agent code you provided does not exist." 
      };
    }
    
    return { 
      valid: true, 
      agentRef: querySnapshot.docs[0].ref,
      agentData: querySnapshot.docs[0].data()
    };
  } catch (error) {
    console.error("Error validating agent code:", error);
    return { 
      valid: false, 
      message: "Error validating agent code. Please try again." 
    };
  }
};

export const handleBookingProcess = async ({
  userInfo,
  formData,
  hostelId,
  managerId,
  hostelData,
  managerEmail,
  router,
  onSuccess,
  onError,
  onFinally
}) => {
  try {
    const isFirstBooking = !userInfo.noOfBooking || userInfo.noOfBooking < 1;

    // Allow first free booking
    if (isFirstBooking) {
      showBookingConfirmation({
        formData,
        managerId,
        userInfo,
        hostelId,
        hostelData,
        managerEmail,
        onSuccess,
        onError,
        onFinally,
      });
      return;
    }

    const hasPaid = userInfo.paymentStatus;
    const lastPaid = userInfo.paymentDate?.toDate?.();
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    const isExpired = !lastPaid || lastPaid < sixMonthsAgo;

    if (!hasPaid || isExpired) {
      // Tiered check
      if (userInfo.balance >= ACCESS_FEE) {
        Alert.alert(
          'Confirm Payment',
          `You've used your free booking. Subscribe with GHC ${ACCESS_FEE} for 6-month unlimited access?`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => onFinally() },
            {
              text: 'Yes',
              onPress: async () => {
                try {
                  await processPayment(userInfo, ACCESS_FEE);
                  showBookingConfirmation({
                    formData,
                    managerId,
                    userInfo: { ...userInfo, paymentStatus: true }, // ensure logic passes downstream
                    hostelId,
                    hostelData,
                    managerEmail,
                    onSuccess,
                    onError,
                    onFinally,
                  });
                } catch (e) {
                  console.error('Payment failed', e);
                  Alert.alert('Error', 'Payment failed. Try again.');
                  onFinally();
                }
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Top Up Required',
          `You've used your free booking. Top up your wallet with at least GHC ${ACCESS_FEE} to subscribe and continue for unlimited booking.`,
          [
            {
              text: 'Top Up',
              onPress: () => router.push('/(ProfileScreens)/transactions')
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => onFinally()
            }
          ]
        );
      }
      return;
    }

    // Already paid and still valid
    showBookingConfirmation({
      formData,
      managerId,
      userInfo,
      hostelId,
      hostelData,
      managerEmail,
      onSuccess,
      onError,
      onFinally,
    });

  } catch (error) {
    console.error('Error in booking process:', error);
    onError();
    onFinally();
  }
};

const checkAndProcessPayment = ({ userInfo, router, onFinally, onSuccess }) => {
  if (userInfo.balance < ACCESS_FEE) {
    Alert.alert(
"Unlock Unlimited Bookings",
`Pay a one-time GHC ${ACCESS_FEE} commitment fee to gain full access for 6 months. Book as many hostels as you want, anytime. This helps support HostelHubb’s mission to make hostel search stress-free for everyone.`

      [
        { text: "Deposit Money", onPress: () => router.push("/transactions") },
        { text: "Cancel", style: "cancel", onPress: () => onFinally() }
      ]
    );
    return;
  }
  
  Alert.alert(
    "Confirm Deduction",
    `You'll be charged GHC ${ACCESS_FEE} for a 6-month booking access. No extra charges for multiple bookings during this period. Proceed?`,
    [
      { text: "No", style: "cancel", onPress: () => onFinally() },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await processPayment(userInfo, ACCESS_FEE);
            onSuccess();
          } catch (error) {
            console.error("Error updating transaction or user balance:", error);
            Alert.alert("Error", "Payment failed. Please try again.");
            onFinally();
          }
        }
      }
    ]
  );
};

const processPayment = async (userInfo, amount) => {
  // Deduct amount and update balance
  const newBalance = userInfo.balance - amount;
  const transactionId = new Date().getTime();
  const transactionRef = doc(collection(db, "transaction"), transactionId.toString());

  // Create transaction record
  await setDoc(transactionRef, {
    userId: userInfo.id,
    amount: amount,
    status: "completed",
    createdAt: new Date(),
    method: "HostelHubb Payment",
    reference: "Paid To Use",
  });

  // Update user's balance and payment status
  const userRef = doc(db, "Student_Users", userInfo.id);
  await setDoc(userRef, {
    balance: newBalance,
    paymentStatus: true,
    paymentDate: new Date(),
  }, { merge: true });

  return true;
};

const showBookingConfirmation = ({
  formData,
  managerId,
  userInfo,
  hostelId,
  hostelData,
  managerEmail,
  onSuccess,
  onError,
  onFinally
}) => {
  Alert.alert(
    'Confirm Booking', 
    'Are you sure you want to book this hostel? Once your booking is accepted, you’ll be required to make payment through the HostelHubb app to the hostel to secure your room.', 
    [
      { 
        text: 'Cancel', 
        style: 'cancel', 
        onPress: () => onFinally()
      },
      {
        text: 'Yes',
        onPress: () => processFinalBooking({
          formData,
          managerId,
          userInfo,
          hostelId,
          hostelData,
          managerEmail,
          onSuccess,
          onError,
          onFinally
        })
      }
    ]
  );
};

const processFinalBooking = async ({
  formData,
  managerId,
  userInfo,
  hostelId,
  hostelData,
  managerEmail,
  onSuccess,
  onError,
  onFinally
}) => {
  try {
    // Add booking record
    const bookingData = {
      ...formData,
      adminUid: managerId,
      userId: userInfo.id,
      hostelId,
      status: 'pending',
      bookingDate: new Date(),
    };

    await addBooking(bookingData);
    await incrementBookingCount(hostelId);

    // Email Notification
    const adjustedPrice = Math.round(Number(formData.selectedPayment) * 1.05);

    sendBookingEmail({
      customerEmail: formData.email,
      managerEmail,
      hostelName: hostelData.hostelName,
      price: adjustedPrice,
      roomType: formData.selectedRoomType,
      bookerName: formData.fullName,
    });

    // Update user's noOfBooking field
    const userRef = doc(db, "Student_Users", userInfo.id);
    const updatedBookingCount = userInfo.noOfBooking ? userInfo.noOfBooking + 1 : 1;

    await updateDoc(userRef, {
      noOfBooking: updatedBookingCount
    });

    // Show success alert
    Alert.alert(
      'Successful Booking',
      'Booking placed successfully. The hostel manager has been notified.Check "My Bookings" for updates. Once accepted, pay through the HostelHubb app to the hostel manager to secure your room.'
    );

    // If it's their first booking, notify about free trial and next step
    if (!userInfo.noOfBooking || userInfo.noOfBooking < 1) {
      Alert.alert(
        'Free Booking Used',
        'This was your free booking. Once accepted, you must complete payment within 24 hours or your booking will be revoked. Future bookings require a GHC 20 access fee for 6 months of unlimited access.'
      );
    }

    onSuccess();
  } catch (error) {
    console.error("Error in final booking process:", error);
    onError();
    onFinally();
  }
};

