import { addDoc, collection, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../app/firebase/FirebaseConfig';

export const addBooking = async (bookingData) => {
  return await addDoc(collection(db, 'Bookings'), bookingData);
};

export const incrementBookingCount = async (hostelId) => {
  const hostelRef = doc(db, 'Hostels', hostelId);
  return await updateDoc(hostelRef, {
    bookings: increment(1),
  });
};
