import { sendBookingEmail as sendEmail } from "../bookingModalUtils";

/**
 * Send booking confirmation email
 * 
 * DATA SENT TO EMAIL SERVICE:
 * @param {Object} emailData
 * @param {string} emailData.customerEmail - Customer's email address
 * @param {string} emailData.hostelName - Name of the accommodation/hostel
 * @param {string} emailData.roomType - Type of room booked (e.g., "TwoInARoom")
 * @param {string} emailData.bookerName - Full name of the person booking
 * 
 * @returns {Promise<void>}
 */
export const sendBookingConfirmationEmail = async (emailData) => {
  try {
    await sendEmail({
      customerEmail: emailData.customerEmail,
      hostelName: emailData.hostelName,
      roomType: emailData.roomType,
      bookerName: emailData.bookerName,
    });
  } catch (emailErr) {
    console.error('Email notification error:', emailErr);
    throw emailErr;
  }
};