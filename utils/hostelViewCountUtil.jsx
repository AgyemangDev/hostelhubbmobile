import { db } from '../app/firebase/FirebaseConfig';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

/**
 * Updates the view count for a hostel in Firebase
 * @param {string} hostelId - The ID of the hostel to update
 */
export const updateHostelViewCount = async (hostelId) => {
  try {
    if (!hostelId) {
      console.warn("No hostelId provided to updateHostelViewCount");
      return;
    }

    const hostelInfoRef = doc(db, "Hostels", hostelId);
    
    // Fetch the document snapshot
    const docSnapshot = await getDoc(hostelInfoRef);
    
    if (docSnapshot.exists()) {
      // Update the views field by incrementing it
      await updateDoc(hostelInfoRef, {
        views: increment(1),
      });
    } else {
      console.warn(`No document found for hostelId: ${hostelId}`);
    }
  } catch (error) {
    console.error("Error updating hostel views:", error);
  }
};