import { Alert, Platform } from "react-native";
import { doc, setDoc, collection } from "firebase/firestore";

export const handleHostelCardPress = async ({
  userInfo,
  user,
  db,
  onCardPress,
  transactionScreen,
  setIsLoading,
}) => {
  const currentDate = new Date();
  const paymentDate = userInfo.paymentDate
    ? userInfo.paymentDate.toDate()
    : null;
  const timeDifference = currentDate - paymentDate;
  const sixMonthsInMilliseconds = 3 * 30 * 24 * 60 * 60 * 1000;
  const isPaymentRecent = timeDifference <= sixMonthsInMilliseconds;

  // Determine the access fee based on the platform
  const ACCESS_FEE = 30;


 {/*
   if (isPaymentRecent) {
    onCardPress();
    return;
  }

  if (!userInfo.paymentStatus) {
    if (userInfo.balance < ACCESS_FEE) {
      Alert.alert(
        "Unlock Full Access",
        `To unlock full access to our hostels and features, please complete a payment of GHC ${ACCESS_FEE} to HostelHubb as subscription fee for 6 months. You can make a deposit by navigating to the Transactions section in your profile.`,
        [
          { text: "Deposit Money", onPress: transactionScreen },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    } else {
      Alert.alert(
        "Confirm Deduction",
        `HostelHubb would like to deduct ${ACCESS_FEE} from your account to access full functionality as subscription fee for 3 months.`,
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes",
            onPress: async () => {
              setIsLoading(true);
              const newBalance = userInfo.balance - ACCESS_FEE;
              const transactionId = new Date().getTime();
              const transactionRef = doc(
                collection(db, "transaction"),
                transactionId.toString()
              );

              try {
                await setDoc(transactionRef, {
                  userId: userInfo.id,
                  amount: ACCESS_FEE,
                  status: "completed",
                  createdAt: new Date(),
                  method: "HostelHubb Payment",
                  reference: "Paid To Use",
                });

                const userRef = doc(db, "Student_Users", user.uid);

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
                  "Payment Successful",
                  "Enjoy your bookings. Hostel Bookings Just Got Easier",
                  [{ text: "OK", onPress: () => setIsLoading(false) }]
                );

                onCardPress();
              } catch (error) {
                console.error(
                  "Error updating transaction or user balance:",
                  error
                );
              }
            },
          },
        ]
      );
    }
  } else {
    onCardPress();
  }

  if (timeDifference > sixMonthsInMilliseconds) {
    await setDoc(
      doc(db, `Student_Users`, user.uid),
      {
        paymentStatus: false,
        paymentDate: null,
      },
      { merge: true }
    );
  }
  */}

  // Free access for everyone
 onCardPress();
};
