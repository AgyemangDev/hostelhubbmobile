export const ACCESS_FEE = Number(process.env.EXPO_PUBLIC_ACCESS_FEE);
export const ACCESS_DURATION_MONTHS = 6;

export const BOOKING_MESSAGES = {
  FIRST_TIME_SUCCESS: {
    title: '🎉 Hurray!',
    message: "You've used your first free booking. Booking submitted successfully! You can track your bookings in your Bookings folder.",
  },
  BOOKING_SUCCESS: {
    title: 'Booking Submitted',
    message: 'Your booking has been made and is awaiting confirmation. Check your Bookings folder for updates.',
  },
  BOOKING_ERROR: {
    title: 'Unable to Complete Booking',
    message: 'Something went wrong. Please try again or contact support if the issue persists.',
  },
  PAYMENT_ERROR: {
    title: 'Payment Issue',
    message: "We couldn't process your payment. Please try again.",
  },
};