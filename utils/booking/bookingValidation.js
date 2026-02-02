import { ACCESS_DURATION_MONTHS } from "../../constants/bookingConstants";

/**
 * Check if user has valid subscription access
 * 
 * @param {Object} userInfo - User information object
 * @param {boolean} userInfo.paymentstatus - Payment status
 * @param {string} userInfo.paymentdate - Last payment date (ISO string)
 * @returns {boolean} - True if user has active access
 */
export const hasValidAccess = (userInfo) => {
  if (!userInfo.paymentstatus || !userInfo.paymentdate) return false;

  const lastPayment = new Date(userInfo.paymentdate);
  const expiry = new Date(lastPayment);
  expiry.setMonth(expiry.getMonth() + ACCESS_DURATION_MONTHS);

  return new Date() <= expiry;
};

/**
 * Check if user is a first-time booker
 * 
 * @param {Object} userInfo - User information object
 * @param {number} userInfo.noofbooking - Number of bookings made
 * @returns {boolean} - True if first-time booker
 */
export const isFirstTimeBooker = (userInfo) => {
  return !userInfo.noofbooking || userInfo.noofbooking < 1;
};