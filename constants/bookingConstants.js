// HostelHubb's cut, added on top of the owner-set base price for
// accommodation/hubclip bookings, and matched exactly by the backend's own
// PLATFORM_MARKUP_RATE (services/payments/paymentInitiationService.js) that
// computes what actually gets charged via Paystack. Kept as one shared
// constant instead of the literal 1.05 duplicated across screens — that
// duplication is exactly how PayNow.jsx ended up showing a raw price while
// every other screen showed the marked-up one, so a student saw one number
// then got charged a different, higher one.
export const PLATFORM_MARKUP_RATE = 1.05;

export const BOOKING_MESSAGES = {
  FIRST_TIME_SUCCESS: {
    title: '🎉 Booking Submitted!',
    message: "Your booking request has been sent! You can track it in your Bookings folder.",
  },
  BOOKING_SUCCESS: {
    title: 'Booking Submitted',
    message: 'Your booking has been made and is awaiting confirmation from the hostel manager. Check your Bookings folder for updates.',
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