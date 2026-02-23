// utils/BookingAlert.js
import { Alert } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../app/firebase/FirebaseConfig';

const ACCESS_FEE = 30;

export const showBookingAlert = async (hostel, onSuccess, userInfo, setUserInfo, router, setLoading) => {
  console.log(userInfo);

  const noOfBooking = userInfo?.noOfBooking || 0;
  const hasPaid = userInfo?.paymentStatus;
  const lastPaid = userInfo?.paymentDate?.toDate?.();
  const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
  const isExpired = !lastPaid || lastPaid < sixMonthsAgo;

  const previewBookingData = {
    bookingDate: new Date(),
    cancellationDate: null,
    email: userInfo.email,
    userId: userInfo.id,
    gender: userInfo.gender,
    phone: userInfo.phoneNumber,
    fullName: `${userInfo.firstName || ''} ${userInfo.surname || ''}`.trim(),
    hostelId: hostel.id,
    hostelName: hostel.hostelName,
    selectedRoomType: hostel.roomType,
    frontImage: hostel.frontImage || '',
    porterName: hostel.porter?.name || '',
    porterContact: hostel.porter?.number || '',
    institution: hostel.institution || '',
    emergencyContactName: hostel.emergencyContactName || '',
    emergencyContactNumber: hostel.emergencyContactNumber || '',
    selectedPayment: String(hostel.price),
    status: 'pending',
    type: 'hosVideoBook',
    college: '',
    adminEmail: 'hostelhubbofficial@gmail.com',
  };

  console.log('PREVIEW booking data (before confirmation):', previewBookingData);

  // Action to proceed with booking
  const proceedToBooking = async () => {
    // Show loading overlay
    if (setLoading) {
      setLoading(true);
    }

    try {
      await onSuccess(); // Optional additional logic

      const newBookingCount = noOfBooking + 1;

      // Step 1: Update booking count
      await setDoc(doc(db, 'Student_Users', userInfo.id), {
        noOfBooking: newBookingCount,
      }, { merge: true });

      if (setUserInfo) {
        setUserInfo({ ...userInfo, noOfBooking: newBookingCount });
      }

      // Step 2: Construct the booking object
      const bookingRef = doc(db, 'Bookings', `${userInfo.id}_${Date.now()}`);

      const bookingData = {
        bookingDate: new Date(),
        cancellationDate: null, // Can be updated later if cancelled
        email: userInfo.email,
        userId: userInfo.id,
        gender: userInfo.gender,
        phone: userInfo.phoneNumber,
        fullName: `${userInfo.firstName || ''} ${userInfo.surname || ''}`.trim(),
        hostelId: hostel.id,
        hostelName: hostel.hostelName,
        selectedRoomType: hostel.roomType,
        emergencyContactName: hostel.emergencyContactName || '',
        emergencyContactNumber: hostel.emergencyContactNumber || '',
        institution: hostel.institution || '',
        selectedPayment: String(hostel.price),
        frontImage: hostel.frontImage || '',
        porterName: hostel.porter?.name || '',
        porterContact: hostel.porter?.number || '',
        status: 'pending',
        type: 'hosVideoBook',
        college: '',
        adminEmail: 'hostelhubbofficial@gmail.com',
      };

      console.log("Booking Data to Save:", bookingData);

      // Step 3: Save to Firestore
      await setDoc(bookingRef, bookingData);

      // Hide loading overlay
      if (setLoading) {
        setLoading(false);
      }

      // Step 4: Show success alert
      if (newBookingCount === 1) {
        Alert.alert(
          'Free Booking Used 🎉',
          `You've successfully used your free booking! Next bookings will require a GHC 20 subscription for 6 months of unlimited access.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Reservation Successful 🎉',
          `Your reservation has been successfully submitted.\n\nPlease keep checking your status for approval. Once approved, proceed to make payment promptly.\n\n`,
          [{ text: 'OK' }]
        );
      }

    } catch (err) {
      console.error('Booking failed:', err);
      
      // Hide loading overlay on error
      if (setLoading) {
        setLoading(false);
      }
      
      Alert.alert('Error', 'Booking failed. Please try again.');
    }
  };

  // Action to proceed with subscription payment and booking
  const proceedWithPaymentAndBooking = async () => {
    // Show loading overlay
    if (setLoading) {
      setLoading(true);
    }

    try {
      await processPayment(userInfo, ACCESS_FEE);
      if (setUserInfo) {
        setUserInfo({
          ...userInfo,
          balance: userInfo.balance - ACCESS_FEE,
          paymentStatus: true,
          paymentDate: new Date()
        });
      }
      await proceedToBooking();
    } catch (err) {
      console.error('Payment error:', err);
      
      // Hide loading overlay on error
      if (setLoading) {
        setLoading(false);
      }
      
      Alert.alert('Payment Failed', 'Could not process payment. Please try again.');
    }
  };

  // CASE 1: First Booking is Free
  if (noOfBooking < 1) {
    Alert.alert(
      'Free First Booking',
      `You're reserving ${hostel.hostelName} at GH₵${hostel.price}/year for a ${hostel.roomType}.\n\nThis is your free reservation. Proceed to confirm.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reserve Now', onPress: proceedToBooking },
      ]
    );
    return;
  }

  // CASE 2: Subscription Expired or Not Paid
  if (!hasPaid || isExpired) {
    // User has enough balance to subscribe
    if (userInfo.balance >= ACCESS_FEE) {
      Alert.alert(
        'Subscription Needed',
        `You've used your free booking. To continue, subscribe with GH₵${ACCESS_FEE} for 6 months of unlimited hostel bookings.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Pay GH₵20',
            onPress: proceedWithPaymentAndBooking
          }
        ]
      );
    } else {
      // User needs to top up
      Alert.alert(
        'Insufficient Balance',
        `You need a subscription fee of GH₵${ACCESS_FEE} to continue reservation, but your balance is GH₵${userInfo.balance}.\n\nTop up to proceed.`,
        [
          {
            text: 'Top Up Now',
            onPress: () => router.push('/(ProfileScreens)/transactions')
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
    return;
  }

  // CASE 3: User is Subscribed and Eligible
  Alert.alert(
    'Confirm Booking',
    `Booking at GH₵${hostel.price}/year.\n\nWait for confirmation after requesting to book. Payment is made securely through Hostelhubb once accepted.`
,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reserve Now', onPress: proceedToBooking },
    ]
  );
};

// Handles subscription wallet deduction and logs transaction
const processPayment = async (userInfo, amount) => {
  const newBalance = userInfo.balance - amount;
  const transactionId = new Date().getTime().toString();

  await setDoc(doc(db, 'transaction', transactionId), {
    userId: userInfo.id,
    amount,
    status: 'completed',
    createdAt: new Date(),
    method: 'Wallet Deduction',
    reference: 'Subscription Access Fee',
  });

  await setDoc(doc(db, 'Student_Users', userInfo.id), {
    balance: newBalance,
    paymentStatus: true,
    paymentDate: new Date(),
  }, { merge: true });
};