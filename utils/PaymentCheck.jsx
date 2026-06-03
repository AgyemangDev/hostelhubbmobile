import { Alert } from "react-native";
import API_BASE_URL from "../utils/api/api";

export const handleHostelCardPress = async ({
  userInfo,
  user,
  onCardPress,
  transactionScreen,
  setIsLoading,
  showAuthModal,
  refreshUserInfo,
}) => {
  if (!user || !userInfo) {
    showAuthModal?.();
    return;
  }

 const ACCESS_FEE = Number(process.env.EXPO_PUBLIC_ACCESS_FEE);
  const currentDate = new Date();

  const paymentDate = userInfo.paymentdate ? new Date(userInfo.paymentdate) : null;
  const timeDifference = paymentDate ? currentDate - paymentDate : Infinity;
  const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000;
  const isPaymentRecent = paymentDate && timeDifference <= sixMonthsInMs;

  // Subscription expired — reset on backend
  if (paymentDate && timeDifference > sixMonthsInMs && userInfo.paymentstatus) {
    try {
      const token = await user.getIdToken(false);
      await fetch(`${API_BASE_URL}/api/students/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentstatus: false, paymentdate: null }),
      });
      await refreshUserInfo?.(true);
    } catch (err) {
      console.error("Failed to reset payment status:", err);
    }
  }

  // First booking is free
  if (userInfo.noofbooking === 0) {
    onCardPress();
    return;
  }

  // Within subscription window
  if (isPaymentRecent) {
    onCardPress();
    return;
  }

  // Not paid — check balance
  if (!userInfo.paymentstatus) {
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
    }

    Alert.alert(
      "Confirm Deduction",
      `HostelHubb would like to deduct GHC ${ACCESS_FEE} from your account to access full functionality as subscription fee for 6 months.`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            setIsLoading?.(true);
            try {
              const token = await user.getIdToken(false);

              const response = await fetch(`${API_BASE_URL}/api/students/me`, {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  paymentstatus: true,
                  paymentdate: new Date().toISOString(),
                  subscriptionAmount: ACCESS_FEE,
                }),
              });

              if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Payment failed");
              }

              // Refresh after subscription payment so paymentstatus/balance are current
              await refreshUserInfo?.(true);

              Alert.alert(
                "Payment Successful",
                "Enjoy your bookings. Hostel Bookings Just Got Easier",
                [{ text: "OK", onPress: () => setIsLoading?.(false) }]
              );

              onCardPress();
            } catch (error) {
              console.error("Subscription payment error:", error);
              Alert.alert("Error", error.message || "Something went wrong. Please try again.");
              setIsLoading?.(false);
            }
          },
        },
      ]
    );
    return;
  }

  onCardPress();
};