import axios from 'axios';

export const sendBookingEmail = async (emailData) => {
  try {
    await axios.post('https://hostelhubbbackend.onrender.com/api/bookings/send-booking-emails', emailData);
  } catch (error) {
    console.error('Error sending booking email:', error);
  }
};
