import axios from 'axios';

export const formatRoomType = (roomType) => {
  return roomType.replace(/([A-Z])/g, ' $1').trim();
};

export const sendBookingEmail = async (emailData) => {
  try {
    await axios.post('https://hostelhubbbackend.onrender.com/api/bookings/send-booking-emails', emailData);
  } catch (error) {
    console.error('Error sending booking email:', error);
  }
};
